---
"create-newt-app": minor
---

Ship vitest 4 to scaffolded apps

`vitest` and `@vitest/coverage-v8` move from `^3.0.0` to `^4.1.10`, matching the version this repo already runs its own tests on. Vitest 4 builds on Vite 7, which warns when a `.ts` config is loaded as CommonJS, so the API's vitest configs are now `vitest.config.mts` and `vitest.config.e2e.mts`.
