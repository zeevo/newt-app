---
"create-newt-app": patch
---

Select templates by predicate instead of resolving collisions by composition order. Each generated file is now claimed by exactly one template for a given set of options, and scaffolding fails if none or several claim it — so a module can no longer silently overwrite another's file.
