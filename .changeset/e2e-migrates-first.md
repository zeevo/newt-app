---
"create-newt-app": patch
---

Make `test:e2e` work on a fresh scaffold and lint the e2e specs.

- the e2e suite boots `AppModule`, which initialises Better Auth against the database, so on a fresh clone it died with `SCHEMA_MISMATCH - missing tables user, session, account, verification`. `test:e2e` now runs the auth and db migrations first (auth before db, since app tables may reference the auth ones), so it works from any invocation, including `pnpm --filter api test:e2e`
- the api lint glob was `src/**` only, so `test/` was never linted; it now covers `test/**/*.ts` too (oxc mode already lints the whole tree)
- type-checking of `test/` is covered by the companion change that points `typecheck` at the full tsconfig
