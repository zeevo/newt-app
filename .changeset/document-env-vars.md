---
"create-newt-app": patch
---

Document every environment variable the scaffolded app reads. `CORS_ORIGIN` and `PORT` (api) and `API_HOST` (standalone web, build-time) were read but absent from `.env.example`; the Postgres example now points at `docker compose up db`, and the SQLite comment names `DATABASE_URL` (a relative value is left unset on purpose: it would resolve against each package's cwd, not the repo root).
