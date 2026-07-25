---
"create-newt-app": minor
---

Passing any config flag (`--shadcn`, `--database`, `--testing`, `--linter`, `--deployment`, `--nest-di-only`, `--bare`) now runs the CLI non-interactively — using the flags and defaults for the rest. Running with no config flags launches the interactive prompts.

**Breaking:** the `--ci` flag is removed. For a non-interactive default scaffold, pass any explicit flag (e.g. `--testing jest`).
