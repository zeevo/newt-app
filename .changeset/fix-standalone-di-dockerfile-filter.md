---
"create-newt-app": patch
---

Fix the `--deployment standalone --nest-di-only` Dockerfile, which could not build: it filtered the api build by `api`, but DI-only names that package `@<projectName>/api`, so turbo failed with "No package found with name 'api' in workspace".
