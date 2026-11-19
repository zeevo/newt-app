---
"create-newt-app": minor
---

Scaffolded apps now use `format` (write), `format:check`, `lint` (check) and `lint:fix`, matching this repo. ESLint `lint` in `apps/web` no longer runs `next typegen && tsc`; use `pnpm typecheck`.
