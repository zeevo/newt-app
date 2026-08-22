---
"create-newt-app": patch
---

run typecheck as part of `pnpm lint` in oxc apps

`lint` and `lint:check` now chain `turbo run typecheck`, so one command answers whether the code is OK. The standalone `typecheck` script stays for CI, which reports the two separately.
