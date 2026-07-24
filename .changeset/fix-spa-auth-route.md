---
"create-newt-app": patch
---

fix spa (static export) build: exclude the redundant Next.js Better Auth route handler, which cannot be statically exported. In spa mode NestJS serves auth via `AuthModule.forRoot`, so the Next.js handler was both unnecessary and broke `next build` with `output: export`
