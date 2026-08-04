---
"create-newt-app": patch
---

Stop emitting a root `.prettierrc` when `--linter oxc` is selected. The file was registered in the `root` module, so it shipped with every scaffold, while every other prettier artifact (the eslint configs, the `prettier` devDependency, the `format` scripts) belongs to the `eslint-config` module that `oxc` replaces. It is now registered there too, so each linter emits only its own config. The render test asserts this across all 192 combinations.
