---
"create-newt-app": patch
---

Build the standalone api image from the build stage instead of `pnpm deploy`. The deploy step failed outright under pnpm 10 (`ERR_PNPM_DEPLOY_NONINJECTED_WORKSPACE`), and forcing it through left the api crashlooping: `pnpm deploy` hard-copies the source-consumed `auth` and `db` packages into `node_modules`, where Node refuses to strip types. Deriving the stage from `build` keeps them as symlinks into the workspace, which resolve fine, the same way the `migrate` stage already works.
