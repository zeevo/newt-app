---
"create-newt-app": patch
---

Fix the Geist font falling back to the browser default in scaffolded apps. The shadcn `--font-sans` token was self-referential (`var(--font-sans)`) and `font-sans` was applied to `html` while the font variable lives on `body`; the non-shadcn `globals.css` never set `font-family` at all.
