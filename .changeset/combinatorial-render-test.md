---
"create-newt-app": patch
---

Extract module selection out of the CLI into `selectModules(selection)` in `src/templates`, and add a render test that runs it across all 192 valid flag combinations. Each combination asserts that no two selected templates claim the same output filename, that every template renders through EJS, that every rendered `.json` parses, and that every `workspace:*` dependency points at a package that combination actually scaffolds. No change to scaffolded output.
