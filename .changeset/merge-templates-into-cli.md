---
"create-newt-app": patch
---

Fold the `@newt-app/templates` package into `create-newt-app` (now `src/templates/`) and bundle it at build time. The CLI no longer depends on a separately published templates package, so there is one published package and one release per version. No change to scaffolded output.
