---
"create-newt-app": patch
---

Validate the todo title in the `--nest di-only` web route with the same zod check the controller uses in `--nest on` mode. `POST /api/todos` with a non-string, missing or empty title previously stored garbage or 500'd; it now 400s with the same body the controller returns.
