---
"create-newt-app": minor
---

Target the active Node LTS. Scaffolded apps declared `engines.node >= 20.9.0`, but Node 20 reached end of life on 2026-04-30, so new projects were claiming support for an unsupported runtime. The floor is now 24, `@types/node` moves from the maintenance line to `^24`, and CI runs on 24 as well, so the declared floor, the types and the tested runtime all agree.

Node 22 is supported until 2027-04, so anyone who needs to stay there can lower `engines.node` and `@types/node` together in the generated project.
