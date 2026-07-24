---
"create-newt-app": patch
---

add the missing `@projectName/db` workspace dependency to the custom-server and spa api templates — the todo service imports it, so scaffolds in those deployment modes failed to resolve the module (`TS2307`)
