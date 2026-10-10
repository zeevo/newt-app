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
pnpm db:migrate
pnpm build
pnpm --filter @my-app/web start
```

Open [http://localhost:3000](http://localhost:3000).

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
- **DATABASE_URL** — not set for SQLite; the app uses a local file at the repo root (`dev.db`). Set it to a Postgres URL to use Postgres.

## Apps

- **web**: Next.js frontend (port 3000)

## Packages

- **`@my-app/auth`**: better-auth config
- **`@my-app/db`**: Kysely client and migrations
- **`@my-app/ui`**: shared React components
- **`@my-app/eslint-config`**: shared ESLint config
- **`@my-app/typescript-config`**: shared tsconfig

## Formatting

`pnpm format` checks without modifying files and fails if any file is unformatted; `pnpm format:fix` applies formatting.
