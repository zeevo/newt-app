---
"create-newt-app": patch
---

Fail scaffolding when one module's template is silently overwritten by another. Whole-file templates meant a later module could discard an earlier one's work unnoticed — the cause of the SPA static-serving, standalone `output` and custom-server start-script bugs. Overwrites must now be declared, naming the module being replaced.
