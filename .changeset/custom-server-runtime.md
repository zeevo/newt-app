---
"create-newt-app": patch
---

Make `--deployment custom-server` actually run. The single-process server never booted in dev (missing deps) or production (`next start` ran instead of `server.ts`), so `/api/*` was unreachable in both.
