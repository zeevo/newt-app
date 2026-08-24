---
"create-newt-app": patch
---

Declare `dist/**` as a `build` output in the scaffolded `turbo.json`. The task only listed the Next.js `.next` directories, so `api#build` warned about missing outputs and its cache entry restored nothing: after deleting `apps/api/dist`, a cached build left `start:prod` with no `dist/main` to run.
