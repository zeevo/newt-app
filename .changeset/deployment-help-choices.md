---
"create-newt-app": patch
---

list every `--deployment` choice in `--help`

The help text read `Deployment: standalone, spa`, omitting `none`, which is both a valid value and the default. It now reads `Deployment: none, standalone, or spa`, matching the other flags, which already list every choice.
