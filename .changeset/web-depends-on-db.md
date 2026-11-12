---
"create-newt-app": patch
---

With `--nest off`, `apps/web` now depends on the db package, since Next is the only server. The db package re-exports kysely's `sql` so apps can write raw SQL without adding kysely themselves
