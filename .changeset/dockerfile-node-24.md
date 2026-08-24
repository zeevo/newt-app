---
"create-newt-app": patch
---

Build standalone images on `node:24-alpine` instead of `node:22-alpine`. Scaffolded apps declare `"engines": { "node": ">=24.0.0" }`, so every layer of a `--deployment standalone` build logged an unsupported-engine warning.
