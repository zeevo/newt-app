---
"create-newt-app": patch
---

sync checkbox, field, radio-group and switch with current shadcn output

shadcn added focus-visible handling for controls inside a `FieldLabel`; the four templates were emitting the older class strings.
