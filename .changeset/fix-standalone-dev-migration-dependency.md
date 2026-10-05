---
"create-newt-app": patch
---

standalone: `dev` in turbo.json now depends on `^migrate`, so a fresh scaffold runs migrations before `pnpm dev` serves auth routes
