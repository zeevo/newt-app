---
"create-newt-app": patch
---

Fix the jest unit config so specs can load modules that import the auth package.

- the `@thallesp/nestjs-better-auth` mock exported `BetterAuthModule`, but the real package exports `AuthModule`, so any spec that compiled `AppModule` died with `TypeError: Cannot read properties of undefined (reading 'forRoot')`; the mock now exports `AuthModule`, and `forRoot` returns a module Nest can actually compile
- `better-auth` itself is ESM-only, so it is mapped to a small CJS mock as well — on runtimes without `require(esm)` any spec reaching it (e.g. via `@<project>/auth`) failed to load
- a unit spec that compiles `AppModule` ships with nest-on scaffolds, so the failure this issue reports is now covered by the scaffold matrix
