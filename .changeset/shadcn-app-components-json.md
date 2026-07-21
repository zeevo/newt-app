---
"create-newt-app": patch
---

Add an `apps/web/components.json` to shadcn scaffolds, matching the official shadcn monorepo layout. This lets `shadcn add <component>` run from `apps/web` (the flow shadcn's docs prescribe), routing shared components to `packages/ui` and leaving room for app-local ones. Also adds the newer `rtl`/`menuColor`/`menuAccent` fields to both components.json files.
