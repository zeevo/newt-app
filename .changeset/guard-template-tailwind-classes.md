---
"create-newt-app": patch
---

add a CI guard that scans templates for malformed Tailwind class names (e.g. double opacity modifiers like `bg-muted/50/50`), which lint cannot catch
