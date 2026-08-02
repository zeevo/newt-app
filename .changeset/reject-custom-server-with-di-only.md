---
"create-newt-app": patch
---

Reject `--deployment custom-server --nest-di-only`. DI-only overwrites the scripts that would run the custom server, so `apps/web/server.ts` was generated but never invoked — the deployment mode was silently a no-op.
