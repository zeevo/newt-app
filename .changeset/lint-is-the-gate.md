---
"create-newt-app": patch
---

Make `pnpm lint` the gate and add `pnpm lint:fix`.

In eslint mode, `lint` was `eslint --fix` on top of a base config that loads `eslint-plugin-only-warn`, so a file full of `any`s and unused variables printed "2 problems (0 errors, 2 warnings)" and exited 0 — `pnpm lint` could never fail, and only the undocumented `lint:check` could. Now:

- `lint` is the non-mutating check (`--max-warnings 0`, so it fails on any problem in both web and api, which previously disagreed about what lint means)
- `lint:fix` is the fixer (`--fix`; only-warn stays, so it fixes what it can without failing on the rest)
- the now-redundant `lint:check` is gone, and the README and AGENTS.md name the new scripts
- oxc mode gets the same names (`lint` = `oxlint`, `lint:fix` = `oxlint --fix`) so the commands mean the same thing regardless of linter, matching the existing `format` / `format:fix` convention
