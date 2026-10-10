# my-app

Full-stack monorepo: Next.js 16 + NestJS 12 + better-auth + SQLite.

## Quick start

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

NestJS serves the static export and the API from one origin, so point `BETTER_AUTH_URL` at it:

```sh
pnpm db:migrate && pnpm build
cd apps/api
BETTER_AUTH_URL=http://localhost:3001 pnpm start:prod
```

Open [http://localhost:3001](http://localhost:3001). In a real deployment, set `BETTER_AUTH_URL` to the public URL.

## Commands

- `pnpm dev` — run in development
- `pnpm build`, `pnpm typecheck`, `pnpm test` — build, type-check, and test every workspace
- `pnpm lint:check` — lint (fails on errors); `pnpm format:fix` — apply formatting
- `pnpm db:migrate` — run migrations; `pnpm db:make <name>` — scaffold a new one
- `pnpm --filter @my-app/api test:e2e` — run the e2e suite

## Environment

Set in `.env` (a committed `.env.example` documents each one):

- **BETTER_AUTH_URL** — the public origin of the app
- **BETTER_AUTH_SECRET** — a random secret used to sign sessions
- **DATABASE_URL** — not set for SQLite (the app uses `dev.db` at the repo root); set it to a Postgres URL to use Postgres

## Layout

- **`apps/web`** — Next.js frontend (port 3000)
- **`apps/api`** — NestJS backend (port 3001)
- **`packages/`** — `auth`, `db`, `ui`, `eslint-config`, and shared `typescript-config`
