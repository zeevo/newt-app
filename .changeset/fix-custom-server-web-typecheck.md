---
"create-newt-app": patch
---

fix the custom-server deployment build: the Next.js build type-checked `apps/web/server.ts`, which imports the Nest `AppModule` and its decorator-laden controllers, using a tsconfig without decorator support. The custom-server module now excludes `server.ts` from the web tsconfig (it is built separately via `tsconfig.server.json`), so `pnpm build` succeeds. Added `--deployment custom-server` to the scaffold matrix.
