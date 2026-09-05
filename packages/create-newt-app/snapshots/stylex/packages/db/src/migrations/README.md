# Migrations

Kysely migrations run in filename order. Each file exports `up` and `down`.

```bash
pnpm db:make add_widgets   # scaffold a new migration
pnpm db:migrate            # apply pending migrations
```

Migrations are written with Kysely's schema builder, so one file compiles to
both SQLite (dev) and Postgres (prod). Prefer dialect-agnostic column types
(`text`, `integer`) and app-generated string ids over auto-increment.