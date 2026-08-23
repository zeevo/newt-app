---
"create-newt-app": patch
---

Remove `--deployment custom-server`. The mode ran Next.js and Nest in one process behind a hand-written `apps/web/server.ts` that reached into Nest's HTTP server to re-dispatch requests, and it forced dev to depend on the api build because the bridge consumed `apps/api/dist` rather than TS source. `--deployment standalone` and `--deployment spa` remain, and `--nest-di-only` still runs Nest inside the Next.js process for anyone who wants a single process without Nest's HTTP layer.
