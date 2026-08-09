---
"create-newt-app": patch
---

Drop the `font-heading` class from the six shadcn components that carried it, and the `--font-heading` token that backed it. Upstream tags those headings with `cn-font-heading`, which is an authoring marker the shadcn CLI strips on `add`, so a generated component ships no heading font at all. The six templates are now byte-identical to what `npx shadcn add` emits, which keeps future comparisons against upstream free of a permanent local difference.
