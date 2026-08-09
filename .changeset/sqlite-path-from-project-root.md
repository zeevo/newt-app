---
"create-newt-app": patch
---

Resolve the SQLite database from the project root instead of a fixed offset from `process.cwd()`. The cwd differs per caller: `packages/db` when migrating, `apps/web` under dev or start, and the project root under a standalone build. Only the first two matched the old `../../dev.db`, so a standalone build opened a different, empty database two directories above the project and every write failed. Signing up returned a 500 under `--deployment standalone --nest-di-only` while every route still answered, because the tables were in the other file.
