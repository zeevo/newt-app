---
"create-newt-app": patch
---

add `--extras changesets`

Scaffolds `.changeset/config.json` and its README, adds `@changesets/cli` to the root devDependencies, and wires `changeset` and `version-packages` scripts. Combines with `anti-slop`, and unlike it carries no linter requirement, so the extras prompt now appears for both linters.

The config sets `privatePackages: { version: true, tag: false }`. Every package a newt app scaffolds is private, and changesets skips private packages by default: without it `changeset version` reports success, bumps nothing, writes no changelog and leaves the changeset unconsumed.
