---
"create-newt-app": patch
---

Assemble `apps/api/src/app.module.ts` from module contributions instead of four whole-file templates. Each module now declares only its own imports, controllers and providers, so options that vary independently no longer need a template per combination.
