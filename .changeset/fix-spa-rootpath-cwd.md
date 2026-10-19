---
"create-newt-app": patch
---

Serve the SPA static export from a path resolved against the compiled file (`__dirname`) instead of `process.cwd()`. `node apps/api/dist/main` from the repo root 404'd `/` because `join(process.cwd(), '../web/out')` pointed at a directory that does not exist there.
