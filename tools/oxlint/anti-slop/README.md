# anti-slop

Oxlint rules that reject low-evidence TypeScript patterns, vendored from
[dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) at `13909c9e0759` (MIT, see LICENSE).

Upstream ships these to be vendored rather than depended on, so these files are ours to edit.
`.oxlintrc.json` enforces the rules this repo already passes. `no-array-filter-map` and
`require-readable-spacing` are registered but off here, and spacing is also off in scaffolded apps.
The optional Effect rules (`effect/`) are not vendored.

`packages/create-newt-app/src/templates/anti-slop/static/` is a separate copy at the same pin,
shipped to scaffolded apps by `--extras anti-slop`. Re-sync both together.
