# my-app

Full-stack monorepo: Next.js 16 + better-auth + SQLite.

## Quick start

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```sh
pnpm db:migrate && pnpm build
pnpm --filter @my-app/web start
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

- `pnpm dev` — run in development
- `pnpm build`, `pnpm typecheck`, `pnpm test` — build, type-check, and test every workspace
- `pnpm lint:check` — lint (fails on errors); `pnpm format:fix` — apply formatting
- `pnpm db:migrate` — run migrations; `pnpm db:make <name>` — scaffold a new one

## Environment

Set in `.env` (a committed `.env.example` documents each one):

- **BETTER_AUTH_URL** — the public origin of the app
- **BETTER_AUTH_SECRET** — a random secret used to sign sessions
- **DATABASE_URL** — not set for SQLite (the app uses `dev.db` at the repo root); set it to a Postgres URL to use Postgres

## Layout

- **`apps/web`** — Next.js frontend (port 3000)
- **`packages/`** — `auth`, `db`, `ui`, `eslint-config`, and shared `typescript-config`
