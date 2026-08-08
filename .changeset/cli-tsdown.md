---
"create-newt-app": patch
---

Build the CLI with tsdown instead of tsup, which its own README now describes as no longer maintained and points at tsdown as the replacement. The published output is unchanged: the same `dist/index.js` entry the `bin` field names, the same shebang, and the same static template assets under `dist/static`. Sourcemaps are emitted now, which tsup was not doing here.
