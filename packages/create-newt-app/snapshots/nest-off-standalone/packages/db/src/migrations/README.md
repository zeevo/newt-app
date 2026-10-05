# Migrations

Kysely migrations run in filename order. Each file exports `up` and `down`.

```bash
pnpm db:make add_widgets   # scaffold a new migration
pnpm db:migrate            # apply pending migrations
```

Migrations are written with Kysely's schema builder, so one file compiles to
both SQLite (dev) and Postgres (prod). Prefer dialect-agnostic column types
(`text`, `integer`) and app-generated string ids over auto-increment.

Kysely uses the keys in `schema.ts` verbatim as SQL identifiers, so table and
column names in migration DDL must match the camelCase keys in `schema.ts`
exactly (`guestbookEntry`, `userId`, `createdAt`). A snake_case migration
(`guestbook_entry`, `user_id`, `created_at`) builds, lints and typechecks
clean but fails at runtime on the first query:

```
SqliteError: no such table: guestbookEntry
SqliteError: table guestbookEntry has no column named userId
```