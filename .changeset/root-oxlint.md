---
"create-newt-app": minor
---

run oxlint once from the root when `--linter oxc` is selected

oxlint resolves the nearest config per file and covers a monorepo in one pass, so the per-package lint tasks were boilerplate around a tool fast enough not to need caching — and they left `apps/api`, `packages/auth` and `packages/db` unlinted. The root now owns `lint`, `lint:check`, `format` and `format:check`, turbo gains a `typecheck` task in place of `lint`, and `apps/web` keeps its `next typegen && tsc --noEmit` as a `typecheck` script. `--linter eslint` is unchanged.
