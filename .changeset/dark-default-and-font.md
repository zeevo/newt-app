---
"create-newt-app": patch
---

Fix two styling defaults in scaffolded apps. Dark mode is now the real default: the shadcn theme provider sets `enableSystem={false}` so it no longer follows the OS `prefers-color-scheme` and lands on light. The Geist font now actually applies: the shadcn `--font-sans` token was self-referential (`var(--font-sans)`) and `font-sans` was applied to `html` while the font variable lives on `body`; the non-shadcn `globals.css` never set `font-family` at all.
