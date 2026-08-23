---
"create-newt-app": patch
---

Fix `--deployment spa --linter oxc` scaffolding an app that failed `pnpm lint` out of the box. The generated `next.config.js` spread a ternary into an otherwise empty object literal, which trips `unicorn(no-useless-spread)`; the ternary is now assigned directly.
