---
"create-newt-app": minor
---

Add a Kysely-based persistence layer. A new `packages/db` owns one database connection (SQLite in dev, Postgres when `DATABASE_URL` is set) that Better Auth and the app share. Migrations are written with Kysely so a single file runs on both dialects; scaffold and apply them with `pnpm db:make <name>` and `pnpm db:migrate`. The todo example now persists through this layer instead of in-memory state.
