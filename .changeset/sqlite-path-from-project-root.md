---
"create-newt-app": patch
---

Honor `DATABASE_URL` for SQLite, and resolve the default from the project root rather than a fixed offset from `process.cwd()`. The cwd differs per caller: `packages/db` when migrating, `apps/web` under dev or start, and the project root under a standalone build. Only the first two matched the old `../../dev.db`, so a standalone build opened a different, empty database two directories above the project and every write failed. Signing up returned a 500 under `--deployment standalone --nest-di-only` while every route still answered, because the tables were in the other file.

The turbo tasks that reach the database now declare `DATABASE_URL`, without which Turbo's strict environment mode dropped it before `migrate` and `build` could see it.
