---
"create-newt-app": minor
---

The todo example is now opt-in via `--include-example`, matching how `--shadcn` works.

**Breaking:** the `--bare` flag is removed, and a non-interactive run without `--include-example` no longer scaffolds the todo example. Pass `--include-example` to keep it. The interactive prompt is unchanged and still defaults to including it.
