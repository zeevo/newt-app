---
"create-newt-app": patch
---

Stop scaffolding the Next.js `/api/auth` handler when NestJS is on. In those modes Nest serves Better Auth (`AuthModule.forRoot`) and the web app proxies `/api` to it, so the handler was shadowed dead code: requests to `/api/auth/*` never reached it and edits to it did nothing. The handler still ships in `--nest off` and `--nest di-only`, where nothing else serves `/api/auth`.
