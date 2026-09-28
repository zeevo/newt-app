---
"create-newt-app": minor
---

Split formatting into a check and a fix: `pnpm format` now checks without modifying files, and a new `pnpm format:fix` applies formatting. The scaffolder's own post-install format step now calls `format:fix`.
