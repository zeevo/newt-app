---
"create-newt-app": patch
---

`packages/auth/package.json` now declares `"type": "module"`, like `packages/db`, so Postgres projects no longer print Node's `MODULE_TYPELESS_PACKAGE_JSON` warning on every `pnpm dev`, `pnpm db:migrate` and `pnpm db:generate`.
