---
"create-newt-app": patch
---

Reject `--testing` combined with `--nest off` with a clear message, the way the other dead combinations are rejected. Every testing config, script and dev dependency lands in `apps/api`, which `--nest off` never scaffolds, so the choice was silently ignored before.
