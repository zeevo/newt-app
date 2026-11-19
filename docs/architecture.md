# Architecture

How a scaffolded app fits together when it's generated with Next, Nest, Better Auth and Postgres. Each level zooms in on a box from the level above it.

Next serves the pages and every `/api` route. Nest is not a server here: its modules are booted as an in-process Dependency Injection Container inside the Next server, and route handlers pull services out of it. Auth and the query builder share one connection pool to the database.

Dashed parts are hypothetical. They show a REST resource, `/api/items`, added the way this setup is built for. Nothing named `items` ships with the scaffold.

## Level 1: Context

Who uses it and what it depends on.

```mermaid
flowchart LR
  user["User<br/>signs up, signs in, signs out"]
  app["Web app<br/>Next + Nest<br/>one container"]
  db[("Database<br/>Postgres")]

  user -- "HTTP, JSON, session cookie" --> app
  app -- "SQL over a connection pool" --> db
```

That's the whole outside world. There's no email provider, OAuth provider, cache, queue, or object store. Email addresses are never verified because nothing sends mail.

## Level 2: Containers

What runs where.

```mermaid
flowchart LR
  browser["Browser<br/>React client<br/>TanStack Query, auth client"]

  subgraph web["web container: node apps/web/server.js, port 3000"]
    nextjs["Next<br/>pages + route handlers<br/>Auth"]
    nestjs["Nest DI Container<br/>no HTTP listener"]
    nextjs -- "in-process function call" --> nestjs
  end

  database[("Database container<br/>postgres:17-alpine")]

  browser -- "HTTP + cookie" --> nextjs
  web -- "SQL, one pool" --> database
```

Next and Nest ship as one image and share one Node process, so a route handler calling a Nest service is a plain function call, not a network hop. The web container waits for the database's health check before it starts.

## Level 3: Components

Modules inside the process.

```mermaid
flowchart LR
  subgraph browser["Browser"]
    authClient["authClient<br/>better-auth/react"]
    queryClient["QueryClient<br/>TanStack Query"]
  end

  subgraph process["One Node process"]
    subgraph nextjs["Next: apps/web"]
      authRoute["/api/auth/[...all]<br/>GET POST"]
      helloRoute["/api/hello<br/>GET"]
      itemsRoute["/api/items<br/>GET POST PATCH DELETE<br/>(hypothetical)"]:::hyp
      auth["Auth<br/>Better Auth"]
      inject["lib/nest.ts<br/>inject(token)<br/>container built on first call"]
    end

    subgraph nestjs["Nest: apps/api, Dependency Injection Container"]
      appModule["AppModule"]
      appService["AppService<br/>getHello()"]
      itemsService["ItemsService<br/>in ItemsModule<br/>(hypothetical)"]:::hyp
    end
  end

  subgraph dbpkg["Database access: packages/db"]
    queryBuilder["Query builder<br/>Kysely, exported as db"]
    pool["Connection pool<br/>pg, exported as driver"]
  end

  database[("Database: Postgres<br/>user, session, account, verification")]

  authClient -- "cookie" --> authRoute
  queryClient -- "fetch" --> helloRoute
  queryClient -.-> itemsRoute
  authRoute --> auth
  helloRoute --> inject
  itemsRoute -. "getSession()" .-> auth
  itemsRoute -. "inject(ItemsService)" .-> inject
  inject -- "ctx.get()" --> appService
  inject -.-> itemsService
  appModule -- "provides" --> appService
  itemsService -. "queries" .-> queryBuilder
  queryBuilder --> pool
  auth -- "database: driver" --> pool
  pool -- "DATABASE_URL" --> database

  classDef hyp stroke-dasharray: 5 5
```

Route handlers own HTTP: the session check, body validation and status codes. Nest services own the logic and the queries. Without the hypothetical resource, the only database traffic comes from Auth.

## Level 4: Code

### A sign-in

```mermaid
sequenceDiagram
  participant F as AuthForm
  participant C as authClient
  participant R as /api/auth/[...all]
  participant A as Auth
  participant D as Database

  F->>C: signIn.email({ email, password })
  C->>R: POST /api/auth/sign-in/email
  R->>A: hand request to Auth
  A->>D: find user by email
  A->>D: read credential account
  Note over A: verify password hash, mismatch returns an error
  A->>D: INSERT session (token, expiresAt)
  A-->>R: Response + Set-Cookie
  R-->>C: 200, cookie stored
  C-->>F: { data, error }
  Note over C: useSession() updates, page.tsx re-renders
```

Sign-up takes the same path through `/sign-up/email`, inserting a `user` and a credential `account` row before creating the session. The password hash lives on `account`, not `user`. Every later request carries the cookie, and server code reads it with `auth.api.getSession()`.

### A REST call (hypothetical)

```mermaid
sequenceDiagram
  participant B as Browser
  participant R as /api/items route (hypothetical)
  participant A as Auth
  participant N as lib/nest.ts
  participant S as ItemsService (hypothetical)
  participant D as Database

  B->>R: GET /api/items + cookie
  R->>A: getSession({ headers })
  A->>D: look up session by cookie token
  A-->>R: session or null
  alt no session
    R-->>B: 401
  else signed in
    R->>N: inject(ItemsService)
    N-->>R: singleton from the DI container
    R->>S: list(session.user.id)
    S->>D: SELECT ... WHERE userId
    D-->>S: rows
    S-->>R: Item[]
    R-->>B: 200 JSON
  end
```

Every protected verb follows this shape. POST and PATCH add one step after the session check: parse the body with a schema and return 400 on failure. Services throw Nest exceptions such as `NotFoundException`, and the handler turns them into status codes.

### Tables

```mermaid
erDiagram
  user ||--o{ session : "has"
  user ||--o{ account : "has"
  user ||--o{ item : "owns (hypothetical)"

  user {
    string id PK
    string name
    string email UK
    boolean emailVerified
    string image
    timestamp createdAt
    timestamp updatedAt
  }
  session {
    string id PK
    string userId FK
    string token "cookie value"
    timestamp expiresAt
    string ipAddress
    string userAgent
    timestamp createdAt
    timestamp updatedAt
  }
  account {
    string id PK
    string userId FK
    string providerId
    string accountId
    string password "hash"
    string accessToken
    string refreshToken
    string idToken
    timestamp createdAt
    timestamp updatedAt
  }
  verification {
    string id PK
    string identifier
    string value
    timestamp expiresAt
  }
  item {
    string id PK
    string userId FK
    timestamp createdAt
    timestamp updatedAt
  }
```

`user`, `session`, `account` and `verification` belong to Better Auth; `verification` stays empty because nothing sends mail. `item` is hypothetical: one row per resource, owned by a user, read and written only by `ItemsService`.

## Workspaces

| Workspace                    | What it is                                                                   | Used by        |
| ---------------------------- | ---------------------------------------------------------------------------- | -------------- |
| `apps/web`                   | Next app: pages, route handlers, `lib/nest.ts` bridge, auth client           | entry point    |
| `apps/api`                   | Nest modules and services, exported as a library (`AppModule`, `AppService`) | web            |
| `packages/auth`              | The `betterAuth()` instance (email and password)                             | web            |
| `packages/db`                | Query builder (Kysely), connection pool (pg), table types                    | api, auth, web |
| `packages/ui`                | shadcn components on Base UI, Tailwind 4 globals, theme toggle               | web            |
| `packages/typescript-config` | Shared tsconfig bases                                                        | all            |
