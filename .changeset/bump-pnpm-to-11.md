---
"create-newt-app": patch
---

scaffold on pnpm 11.25.0, up from 10.34.5. pnpm 11 stopped reading the `pnpm` field in package.json, so build approvals move to `allowBuilds` in `pnpm-workspace.yaml`, and `@parcel/watcher` and `@swc/core` join the list: pnpm 11 fails the install on an unapproved build script instead of warning.
