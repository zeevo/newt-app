---
"create-newt-app": patch
---

Run the auth migrations before the app migrations. Turbo ran the `db` package's Kysely migrations first (it has no workspace dependencies), so on a fresh clone a day-two migration that references `user` (a `references("user.id")` foreign key, or an `ALTER TABLE user`) ran before `auth migrate` had created the auth tables, and failed. The `db` migrate script now runs the auth package's migrate first, so the auth tables exist before the app migrations.
