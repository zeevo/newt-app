---
"create-newt-app": patch
---

Fix the render test, which broke when the versions registry and the combinatorial render test landed in separate PRs: `TemplateData` gained a required `versions` field that the test did not supply, so all 192 cases failed once both were on main. Also re-export `Selection` from `src/types.ts`, which `src/utils.ts` has always imported but never received, and add a `typecheck` script wired into CI. `tsc --noEmit` catches both of these; nothing ran it before because tsup does not typecheck. No change to scaffolded output.
