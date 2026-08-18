---
"create-newt-app": patch
---

The newt-app repo now lints itself with oxlint instead of ESLint, matching the layout `create-newt-app --linter oxc` scaffolds: one root `.oxlintrc.json` and an `oxlint` dev dependency per package. Scaffolded apps are unaffected; both `--linter eslint` and `--linter oxc` still generate what they did before.
