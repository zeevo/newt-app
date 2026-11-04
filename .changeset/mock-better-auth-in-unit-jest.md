---
"create-newt-app": patch
---

Fix the `@thallesp/nestjs-better-auth` jest mock: it exported `BetterAuthModule`, but the real package exports `AuthModule`, so any unit spec that compiled `AppModule` died with `TypeError: Cannot read properties of undefined (reading 'forRoot')`. The mock now exports `AuthModule`, and `forRoot` returns a module Nest can compile.
