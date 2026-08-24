---
"create-newt-app": patch
---

match the standalone compose file to the selected database

`--deployment standalone` always emitted a Postgres `DATABASE_URL` and a `db: postgres:17-alpine` service, even for sqlite, which is the default. better-sqlite3 read that connection string as a file path and the migrate container died with `Cannot open database because the directory does not exist`, so the stack never came up.

A sqlite scaffold now drops the `db` service and its healthcheck `depends_on` conditions, and points `DATABASE_URL` at `/data/app.db` on a `db_data` volume shared by web, api, and migrate. Postgres output is unchanged.
