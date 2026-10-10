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

```sh
docker compose up --build
```

The `migrate` service applies migrations before the app starts. Open [http://localhost:3000](http://localhost:3000); set `BETTER_AUTH_URL` to the public URL in a real deployment.

## Commands

- `pnpm dev`: run in development
- `pnpm build`, `pnpm typecheck`, `pnpm test`: build, type-check, and test every workspace
- `pnpm lint:check`: lint (fails on errors); `pnpm format:fix`: apply formatting
- `pnpm db:migrate`: run migrations; `pnpm db:make <name>`: scaffold a new one
- `pnpm --filter @my-app/api test:e2e`: run the e2e suite

## Environment

Set in `.env` (a committed `.env.example` documents each one):

- **BETTER_AUTH_URL**: the public origin of the app
- **BETTER_AUTH_SECRET**: a random secret used to sign sessions
- **DATABASE_URL**: your Postgres connection string

## Layout

- **`apps/web`**: Next.js frontend (port 3000)
- **`apps/api`**: NestJS backend (port 3001)
- **`packages/`**: `auth`, `db`, `ui`, and shared `typescript-config`
