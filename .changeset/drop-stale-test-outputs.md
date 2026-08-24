---
"create-newt-app": patch
---

Remove the stale `outputs: ["coverage/**"]` key from the `test` task in the scaffolded `turbo.json`. The `test` script runs `jest` / `vitest run`, which writes no coverage (that is `test:cov`, which is not a turbo task), so turbo printed a "no output files found for task api#test" warning on every `pnpm test`.
