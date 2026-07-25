---
"create-newt-app": minor
---

Passing any config flag (`--shadcn`, `--database`, `--testing`, `--linter`, `--deployment`, `--nest-di-only`, `--bare`) now runs the CLI non-interactively — `--ci` is no longer required to use flags. Running with no config flags still launches the interactive prompts, and `--ci` remains as an explicit "use defaults, skip prompts" opt-in.
