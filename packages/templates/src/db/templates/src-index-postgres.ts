export default {
  filename: "packages/db/src/index.ts",
  template: `import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./schema.js";

// Postgres connection (DATABASE_URL), shared by Better Auth (\`driver\`) and your
// app (\`db\`).
export const driver = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool: driver }),
});

export type Database = Kysely<DB>;`,
};
