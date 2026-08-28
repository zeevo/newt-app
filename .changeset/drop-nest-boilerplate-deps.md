---
"create-newt-app": patch
---

drop the Nest boilerplate a scaffolded api never uses

`apps/api` declared five devDependencies nothing in the scaffold imports: `ts-node`, `tsconfig-paths`, `ts-loader`, `source-map-support` and `@eslint/eslintrc`. The first two came from the Nest starter manifest and were repeated in the DI-only and SPA manifests; the next two were injected by the jest module; the last was injected for the api's flat ESLint config, which uses `@eslint/js` and never touches `eslintrc`. Their only remaining reference was `test:debug`, which now runs `node --inspect-brk node_modules/.bin/jest --runInBand` (ts-jest already handles the transform). Jest 30 reads `jest.config.ts` on its own, so nothing needed a TypeScript loader.

The api manifest also carried `"description": ""`, `"author": ""` and `"license": "UNLICENSED"` from the same starter, plus a `start:dev` that duplicated `dev` verbatim. Both are gone, which matches the other scaffolded packages.

`apps/api/eslint.config.mjs` hardcoded `globals.jest` regardless of `--testing`. A vitest scaffold now gets `globals.vitest`, so `vi`, `assertType` and `expectTypeOf` are in scope instead of jest's set. No lint result changes: typescript-eslint turns `no-undef` off for TypeScript files, so the wrong list was inert.
