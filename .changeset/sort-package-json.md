---
"create-newt-app": patch
---

Alphabetize the `scripts` and dependency fields in every scaffolded `package.json`. Module injection appended deps and scripts to the end, leaving generated `package.json` files out of order; a small post-scaffold pass sorts them (no new dependency).
