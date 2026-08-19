---
"create-newt-app": minor
---

add `--extras anti-slop`, which vendors dmmulroy/anti-slop into the scaffolded app

The rules are an oxlint plugin, so the flag needs `--linter oxc` and is rejected with eslint. `tools/oxlint/anti-slop` holds the plugin source, `.oxlintrc.json` registers it and turns all 15 rules on as errors, and `pnpm lint` enforces them from the first commit. Vendored shadcn components are exempt, since they are upstream code rather than code you write.
