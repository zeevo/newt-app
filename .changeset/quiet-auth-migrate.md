---
"create-newt-app": patch
---

Silence the Better Auth schema-mismatch error on the first `pnpm dev`. The `auth migrate` CLI constructs the auth instance to read its config, so better-auth validated the schema against the still-empty database and logged a red error immediately before the migration that fixed it. The generated config now sets `advanced.database.validateSchema` to false.
