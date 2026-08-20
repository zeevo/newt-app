# anti-slop

Oxlint rules that reject low-evidence TypeScript patterns, vendored from
[dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) at `6d538555cb15` (MIT, see LICENSE).

Upstream ships these to be vendored rather than depended on, so these files are ours to edit.
`.oxlintrc.json` enforces the rules this repo already passes; `.oxlintrc.anti-slop.json` holds
the rest behind `pnpm lint:anti-slop`.

`packages/create-newt-app/src/templates/anti-slop/static/` is a separate copy at the same pin,
shipped to scaffolded apps by `--extras anti-slop`. Re-sync both together.
