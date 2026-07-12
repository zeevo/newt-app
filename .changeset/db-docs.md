---
"create-newt-app": patch
---

Audit the docs against the current CLI and persistence layer. The Database section and generated README now describe the scaffold-time database choice (SQLite or Postgres, one driver installed) and the shared Kysely connection; the CLI reference documents `--database`, `--nest-di-only`, and `--deployment`; the intro/installation stack and file tree include Kysely and `packages/db`; and the Vercel deployment pages note that Postgres is required (SQLite doesn't persist on serverless).
