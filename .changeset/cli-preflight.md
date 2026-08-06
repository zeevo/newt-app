---
"create-newt-app": minor
---

Check for pnpm, git, and a supported Node version before scaffolding anything. A missing tool used to surface as a spawn error partway through, after the project directory had already been created, which the next attempt then refused to overwrite. Only the tools a run will actually use are required, so `--no-install` still works without pnpm and `--no-git` without git.

A failed `pnpm install` also reported "Installed." and let the run continue into formatting, which then failed with a second, more confusing error. It now fails on the install step.
