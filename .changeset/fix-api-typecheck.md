---
"create-newt-app": patch
---

Make apps/api type-checkable and type-check its specs.

- `tsconfig.json` set `rootDir: "./src"` with no `include`, so the default `**/*` pulled in `jest.config.ts` and `test/`, and `tsc --noEmit` died with TS6059 in every nest-on mode. It now includes `src/**/*` and `test/**/*` explicitly and drops `rootDir` (the build config keeps its own)
- the `exclude` list named `vitest.config.mts`/`vitest.config.e2e.mts` even in jest mode, where they don't exist; explicit `include` makes the stale entries moot
- the `typecheck` script pointed at `tsconfig.build.json`, which excludes `test` and `**/*spec.ts`, so nothing ever type-checked the specs; it now runs `tsc --noEmit` against the full config (same change for the di-only and spa package.json variants)
