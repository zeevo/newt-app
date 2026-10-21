---
"create-newt-app": patch
---

Fail with a message when the prompts are needed but stdin is not a TTY. A piped stdin used to make clack read EOF and cancel with exit 0 — no scaffold, no explanation. The error now points at `--yes` and the config flags that skip the prompts.
