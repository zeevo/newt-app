---
"create-newt-app": patch
---

Fix `--deployment standalone --nest-di-only`. DI-only overwrote the standalone `next.config.js` and dropped `output: "standalone"`, so the Docker build failed copying `.next/standalone`, and the api image stage ran an entrypoint DI-only never emits. DI-only standalone now builds a single web image with Nest wired in.
