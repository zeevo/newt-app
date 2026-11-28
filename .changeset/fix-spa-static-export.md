---
"create-newt-app": patch
---

SPA mode: the static export now uses `trailingSlash: true`, so sub-routes are exported as `out/<route>/index.html`. Previously Nest's `ServeStaticModule` redirected `/about` to `/about/` and the fallback served the home page. `out/**` is also added to the build task's turbo outputs, so a cache hit restores `apps/web/out`.
