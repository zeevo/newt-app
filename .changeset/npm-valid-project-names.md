---
"create-newt-app": patch
---

Normalize the project name instead of scaffolding a broken project. The name becomes the npm scope for every workspace package (`@name/db`, `@name/auth`, `@name/ui`), so `create-newt-app "My App"` used to scaffold happily and then die at `pnpm install` with `ERR_PNPM_INVALID_DEPENDENCY_NAME`. Names are now lowercased, spaces and other characters npm rejects become hyphens, leading `.` or `_` is dropped, and the result is capped at 214 characters. `create-newt-app "My App"` now creates `my-app` with `@my-app/db`, no error and no prompt. Only an empty name, or one with nothing left after normalizing (such as `...`), is still refused.
