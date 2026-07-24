---
"create-newt-app": patch
---

CI now builds each scaffolded app (`pnpm build`) across the flag matrix and, on the default combo, boots it and probes both servers over HTTP — the API at `GET /api/hello` (anonymous, DB-free) and the web homepage — asserting they actually serve. Catches production-build and runtime-boot regressions that lint/test miss.
