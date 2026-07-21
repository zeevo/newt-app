---
"create-newt-app": patch
---

Release workflow now creates a GitHub Release for each published version, cut from the CLI changelog. Switches releasing to the official `changesets/action` (version-PR + publish) which also fixes the empty-commit push failure.
