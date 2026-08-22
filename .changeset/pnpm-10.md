---
"create-newt-app": minor
---

scaffold with pnpm 10

Generated apps pin `pnpm@10.34.5` and declare `pnpm.onlyBuiltDependencies`. pnpm 10 stopped running dependency build scripts unless they are named there, and without it `better-sqlite3` never compiles its bindings, which breaks `pnpm build` on the auth route.
