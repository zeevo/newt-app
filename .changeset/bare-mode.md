---
"create-newt-app": minor
---

Add `--bare`: scaffold without NestJS.

`--bare` emits no `apps/api` at all. Next.js route handlers serve `/api` themselves and query the database through Kysely directly, Better Auth already ran in Next.js, and `packages/{auth,db,ui}` are unchanged. With `--include-example` the to-do example comes as `apps/web/lib/todos.ts` plus the same route handlers, so the URLs and the UI component are identical to the NestJS modes.

The test setup follows: `apps/web` gets the jest or vitest config, deps, and scripts that would otherwise land in `apps/api`.

Deployment extras are rejected in bare mode. Each one either builds `apps/api` into an image or has NestJS serve the Next.js output, and neither exists here.
