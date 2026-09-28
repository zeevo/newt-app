---
"create-newt-app": minor
---

Split linting into a check and a fix: `pnpm lint` now checks without modifying files and fails on any warning, and a new `pnpm lint:fix` applies automatic fixes. The only-warn plugin is gone, so warnings are real errors on the check path.
