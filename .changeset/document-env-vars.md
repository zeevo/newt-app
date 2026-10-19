---
"create-newt-app": patch
---

Document every environment variable the scaffolded app reads. `CORS_ORIGIN` (api) and `API_HOST` (standalone web, build-time) now appear in `.env.example`, each only rendered where the reader exists; the Postgres example points at `docker compose up db`; the SQLite comment names `DATABASE_URL`. Two values are deliberately left unset, with the reason commented: a relative `DATABASE_URL` would resolve against each package's cwd and split the sqlite file, and `PORT` would be picked up by `next start` (the web app loads `.env` too) and move the web server off 3000.
