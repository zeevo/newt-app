# my-app

Full-stack monorepo: Next.js 16 + NestJS 12 + better-auth + Postgres.

## Quick start

```sh
# set DATABASE_URL in .env to your Postgres database
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

`docker-compose.yml` builds and runs the app; the `migrate` service applies migrations before the app starts:

```sh
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Set `BETTER_AUTH_URL` to the public URL in a real deployment.

## Commands

- `pnpm dev` — run the app in development
- `pnpm build` — build every workspace
- `pnpm typecheck` — type-check every workspace
- `pnpm test` — run the unit tests
- `pnpm lint:check` — lint without fixing (fails on errors)
- `pnpm format` / `pnpm format:fix` — check / apply formatting
- `pnpm db:migrate` — run migrations; `pnpm db:make <name>` scaffolds a new one

## Environment

Values live in `.env` (a committed `.env.example` documents each one):

- **BETTER_AUTH_URL** — the public origin of the app
- **BETTER_AUTH_SECRET** — a random secret used to sign sessions
- **DATABASE_URL** — your Postgres connection string

## Apps

- **web**: Next.js frontend (port 3000)
- **api**: NestJS backend (port 3001)

## Packages

- **`@my-app/auth`**: better-auth config
- **`@my-app/db`**: Kysely client and migrations
- **`@my-app/ui`**: shared React components
- **`@my-app/typescript-config`**: shared tsconfig

## Formatting

`pnpm format` checks without modifying files and fails if any file is unformatted; `pnpm format:fix` applies formatting.
