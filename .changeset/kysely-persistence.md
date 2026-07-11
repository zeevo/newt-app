---
"create-newt-app": minor
---

Add a Kysely-based persistence layer. A new `packages/db` owns one database connection — SQLite or Postgres, chosen at scaffold time via the interactive prompt or the `--database` flag — that Better Auth and the app share, so only the selected driver is installed (no mixed `pg` + native `better-sqlite3` deps). Migrations are written with Kysely; scaffold and apply them with `pnpm db:make <name>` and `pnpm db:migrate`. The todo example now persists through this layer instead of in-memory state.
