---
"create-newt-app": minor
---

typecheck every workspace, not just the web app

`pnpm typecheck` reached one package: `apps/api`, `packages/auth`, `packages/db` had no script, and `packages/ui` called its `check-types`, which turbo's task never matched. All five now have one, and the task exists under both linters rather than only oxc.

Turning it on caught two config bugs. `packages/ui` resolved with NodeNext, which cannot follow subpath exports, so `next/link` had no types; the shared react-library config now uses Bundler resolution, matching how a bundler consumes the package. And `apps/api` typechecks through `tsconfig.build.json`, since its `rootDir` of `src` makes a plain `tsc` reject `test/` and `jest.config.ts`.
