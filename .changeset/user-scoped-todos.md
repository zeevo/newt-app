---
"create-newt-app": patch
---

Make the todos example user-scoped. The `todo` table gains a `userId` column, every query is scoped to `session.user.id`, and the controller reads the session with `@Session()` (using a type-only `import type { UserSession }` to sidestep the `isolatedModules` + decorator-metadata TS1272 error). In `--nest-di-only` mode the route handlers resolve the session with `auth.api.getSession` and return 401 when there is none. The default example now demonstrates authenticated, per-user data instead of a global list.
