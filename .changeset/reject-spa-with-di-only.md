---
"create-newt-app": patch
---

Reject `--deployment spa --nest-di-only`. The combination silently produced an app with no static export and no working auth; SPA mode statically exports Next.js, which cannot contain the route handlers DI-only mode runs on.
