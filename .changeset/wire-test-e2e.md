---
"create-newt-app": patch
---

Wire `test:e2e` into the scaffold: migrate first, load the root `.env`, and lint `test/`.

- the e2e suite failed on a fresh scaffold with `BetterAuthError SCHEMA_MISMATCH` because nothing migrated the database first; a root `test:e2e` turbo task now runs the workspace migrations (`dependsOn: ["^migrate"]`) before the api's e2e, and the README points at `pnpm test:e2e`
- the e2e spec is the only entry point that bypasses `src/main.ts`, so it never loaded the root `.env` and better-auth warned `Base URL is not set` on every run; a `test/e2e-env.ts` loaded as the spec's first import applies the same dotenv load (dropped in di-only mode with the rest of the e2e files)
- the api's eslint scripts only globbed `src/**/*.ts`, so the e2e spec was never linted; they now cover `test/**/*.ts` too
