---
"create-newt-app": patch
---

Refresh the vendored shadcn/ui components to the current base-nova registry: update `button`, `card`, `calendar`, `carousel`, `drawer`, and `spinner` to their latest upstream source. `drawer` migrates from `vaul` to `@base-ui/react/drawer` (so `vaul` is dropped and `@base-ui/react` bumps to ^1.6.0). The other ~50 components were already current.
