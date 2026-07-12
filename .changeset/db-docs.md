---
"create-newt-app": patch
---

Update the database docs to match the scaffold-time database choice. The docs "Database" section and the generated README no longer describe a runtime `DATABASE_URL` switch — they reflect that SQLite or Postgres is picked when scaffolding (only that driver is installed) and that the connection is the shared Kysely layer used by Better Auth and the app.
