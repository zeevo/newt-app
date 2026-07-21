---
"create-newt-app": patch
---

Declare Better Auth's core tables (`user`, `session`, `account`, `verification`) in the scaffolded Kysely `DB` interface, with per-dialect column types (ISO strings and 0/1 on SQLite, `Date` and `boolean` on Postgres), so app queries can join against them type-safely.
