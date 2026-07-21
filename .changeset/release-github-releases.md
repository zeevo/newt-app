---
"create-newt-app": patch
---

Release workflow now creates GitHub Releases on publish. Switches releasing to the official `changesets/action` (version-PR + publish, `createGithubReleases`), which also fixes the empty-commit push failure.
