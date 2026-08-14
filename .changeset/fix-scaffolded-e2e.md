---
"create-newt-app": patch
---

Make `pnpm test:e2e` pass in a fresh app

The e2e test requested `GET /` and expected the body `Hello World!`, but the controller serves `@Get('hello')` and returns `{ message: 'Hello from Nest' }`, so the test 404'd in both testing modes. Jest failed even earlier: `@thallesp/nestjs-better-auth` is ESM-only, and the e2e config transformed CommonJS, so the suite could not import `app.module.ts` at all. The jest e2e config now runs in ESM mode.
