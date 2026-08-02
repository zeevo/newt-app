---
"create-newt-app": patch
---

Reject unrecognised values for `--testing`, `--database`, `--linter`, and `--deployment` instead of silently falling back to a default. A typo like `--deployment spaa` now exits with an error naming the valid choices rather than scaffolding with no deployment extras.
