---
"create-newt-app": patch
---

Drop the redundant `pnpm db:migrate` step from the CLI "Next steps" outro. `pnpm dev` already runs migrations (via turbo's `^migrate`), and the SQLite default needs no database setup, so the happy path is just `cd <app>` then `pnpm dev`.
