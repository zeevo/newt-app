---
"create-newt-app": minor
---

Make the example to-do app opt-in and widen the NestJS flag into a mode.

`--bare` is gone. The example app no longer ships by default: pass `--include-example` to get it, which is what the old default emitted. Scaffolding with no flags now produces the app `--bare` used to.

`--full` is new and names the existing default (NestJS as an HTTP server on port 3001). It pairs with `--nest-di-only` on one axis, so passing both is now an error rather than last-one-wins.

Injected dependencies and scripts accept the same `when` predicate templates already had, so a module can target a workspace that only some selections emit.
