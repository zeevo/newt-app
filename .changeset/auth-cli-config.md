---
"create-newt-app": patch
---

Stop the Better Auth schema-mismatch error on the first `pnpm dev`. The `auth` CLI builds the auth instance to read its config, so it validated the schema against the empty database right before migrating it. The `migrate` and `generate` scripts now set `AUTH_CLI=1`, which turns validation off for the CLI only.
