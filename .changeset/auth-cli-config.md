---
"create-newt-app": patch
---

Stop the Better Auth schema-mismatch error on the first `pnpm dev` without disabling schema validation. The `auth migrate` CLI constructs the auth instance to read its config, so better-auth validated the schema against the still-empty database and logged a red error immediately before the migration that fixed it. The generated auth package now keeps its config in `src/options.ts`, exported as `@scope/auth/options`; `src/index.ts` builds the app instance from it with validation left on, and the CLI points at `src/cli.ts`, which builds a throwaway instance with validation off.
