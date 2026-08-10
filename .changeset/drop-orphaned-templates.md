---
"create-newt-app": patch
---

Remove three template files no module imported, so they were never scaffolded: a `form.tsx` left over from before the base-nova migration (which imports Radix while the rest of the package uses Base UI, and which base-nova replaces with `field`), a duplicate `eslint-config`, and a duplicate `jest-e2e.json` already emitted by the testing module. Scaffolded output is unchanged. A test now fails if a template file is not imported by any module, which neither the render tests nor the ui drift check could see, since both walk the registered set.
