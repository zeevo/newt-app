---
"create-newt-app": patch
---

Open the sqlite database with sane pragmas and store todo timestamps in the same format as the auth tables.

- `journal_mode = WAL` so readers don't block writers, `foreign_keys = ON` so any REFERENCES clause actually enforces, and `busy_timeout = 5000` to ride out a concurrent `db:migrate`
- `todo.createdAt` is now set by the app as ISO 8601 (like the id, which is already app-generated) instead of falling back to the `CURRENT_TIMESTAMP` default, which stored `"YYYY-MM-DD HH:MM:SS"` while Better Auth stores `"YYYY-MM-DDTHH:MM:SS.sssZ"` in the same database
