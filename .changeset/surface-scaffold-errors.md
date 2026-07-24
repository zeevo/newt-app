---
"create-newt-app": patch
---

surface scaffold failures instead of swallowing them — a template render or static-file copy error now aborts with a non-zero exit and the real error, rather than printing "Done!" over a half-written project
