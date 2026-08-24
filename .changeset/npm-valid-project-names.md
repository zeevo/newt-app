---
"create-newt-app": patch
---

Reject project names npm cannot use before anything is written. The name becomes the npm scope for every workspace package (`@name/db`, `@name/auth`, `@name/ui`), so `create-newt-app "my app"` used to scaffold happily and then fail at `pnpm install` with `ERR_PNPM_INVALID_DEPENDENCY_NAME`. `validateProjectName` now enforces npm's package name rules (lowercase, no spaces, URL-safe characters, no leading `.` or `_`, 214 characters max) and suggests a fixed name when only case or spacing is wrong. The interactive name prompt runs the same check instead of its own weaker one.
