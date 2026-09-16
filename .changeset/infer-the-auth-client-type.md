---
"create-newt-app": patch
---

drop the plugin-less type annotation on `authClient`, so better-auth client plugins show up on it, and turn off declarations in the Next.js tsconfig, which never emits them and otherwise rejects the inferred type
