---
"create-newt-app": patch
---

The newt-app repo now formats itself with oxfmt instead of Prettier, matching what `create-newt-app --linter oxc` scaffolds: a root `.oxfmtrc.json` and `oxfmt` / `oxfmt --check` as the format scripts. Formatting moves to oxfmt's default 100 column width, and oxfmt also covers `.mjs` and `.css` files that the old Prettier glob missed. Scaffolded apps are unaffected; `--linter eslint` still ships Prettier and `--linter oxc` still ships oxfmt.
