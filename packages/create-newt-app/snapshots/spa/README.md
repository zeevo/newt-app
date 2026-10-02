# my-app

Full-stack monorepo: Next.js 16 + NestJS 12 + better-auth + SQLite.

## Quick start

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

NestJS serves the static export and the API from one origin, so point `BETTER_AUTH_URL` at it:

```sh
pnpm db:migrate
pnpm build
cd apps/api
BETTER_AUTH_URL=http://localhost:3001 pnpm start:prod
```

Open [http://localhost:3001](http://localhost:3001). In a real deployment, set `BETTER_AUTH_URL` to the public URL.

## Apps

- **web**: Next.js frontend (port 3000)
- **api**: NestJS backend (port 3001)

## Packages

- **`@my-app/auth`**: better-auth config
- **`@my-app/db`**: Kysely client and migrations
- **`@my-app/ui`**: shared React components
- **`@my-app/eslint-config`**: shared ESLint config
- **`@my-app/typescript-config`**: shared tsconfig

## Formatting

`pnpm format` checks without modifying files and fails if any file is unformatted; `pnpm format:fix` applies formatting.
