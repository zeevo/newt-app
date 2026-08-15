---
"create-newt-app": minor
---

add `--nest-embedded`, which runs the full NestJS HTTP application inside Next.js

A Pages Router catch-all hands Nest the real Node `req`/`res`, so Nest does all the routing and the whole pipeline runs: guards, middleware, pipes, interceptors, exception filters, custom decorators, versioning, SSE and streaming. The mode reuses the default mode's controllers, `AuthModule` and `AuthGuard` rather than the hand-rolled route handlers `--nest-di-only` needs, and stays a single Next.js app.
