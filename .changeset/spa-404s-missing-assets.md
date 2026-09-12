---
"create-newt-app": patch
---

in spa mode, a missing file such as a stale `/_next` chunk now 404s instead of falling back to `index.html`
