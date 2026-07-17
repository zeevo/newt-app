---
"create-newt-app": minor
---

Add a `--linter` option to choose between ESLint + Prettier (default) and oxc (oxlint + oxfmt). Linting is now owned by the selected linter module — deps, scripts, and config files are injected rather than baked into each app — so picking `oxc` ships no ESLint or Prettier at all, and vice versa.
