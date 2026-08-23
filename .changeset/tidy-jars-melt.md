---
"create-newt-app": patch
---

Stop shipping a broken e2e suite in `--nest-di-only` apps. DI-only Nest has no controllers of its own, so `apps/api/test/app.e2e-spec.ts` could never pass there: the api package never declared supertest, and even with it installed the spec 404s because the route lives in a Next handler. The spec, its runner config, the `test:e2e` script, and the README line are now omitted in that mode. Also adds `vitest/globals` to the DI-only api tsconfig so `--nest-di-only --testing vitest` apps lint clean.
