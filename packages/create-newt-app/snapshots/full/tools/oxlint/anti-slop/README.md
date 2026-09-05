# anti-slop

Oxlint rules that reject low-evidence TypeScript patterns, vendored from
[dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) at `6d538555cb15` (MIT, see LICENSE).

Upstream ships these to be vendored rather than depended on, so these files are
yours: read them, change the messages, delete the rules you disagree with.

`.oxlintrc.json` registers the plugin and turns every rule on as an error.
Turn one off there:

```json
{
  "rules": {
    "anti-slop/no-runtime-typeof": "off"
  }
}
```

Vendored shadcn components under `packages/ui/src/components` are exempt, since
they are upstream code you re-pull rather than write.
