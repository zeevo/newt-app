---
"create-newt-app": patch
---

Fix the standalone Docker deployment to run app migrations. The `migrate` container ran only `auth migrate`, so Kysely app migrations (e.g. the `todo` table) were never applied in production. It now reuses the `build` image and runs `pnpm db:migrate` (Better Auth + Kysely), and the standalone `turbo.json` migrate task is no longer marked interactive.
