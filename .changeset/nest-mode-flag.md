---
"create-newt-app": minor
---

Replace `--nest-di-only` with `--nest on|off|di-only`.

`on` and `di-only` scaffold what the old default and `--nest-di-only` did. `off` is new: no `apps/api`, no `@nestjs/*` anywhere, and Next.js route handlers own the backend. It rejects `--deployment spa` (nothing left to serve the static export) and `--include-example` (the todo example is a Nest module), and scaffolds no test runner, since every testing config targeted `apps/api`.
