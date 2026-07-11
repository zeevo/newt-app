export default {
  filename: "packages/db/src/index.ts",
  template: `import BetterSqlite3 from "better-sqlite3";
import { Kysely, PostgresDialect, SqliteDialect } from "kysely";
import path from "node:path";
import { Pool } from "pg";
import type { DB } from "./schema.js";

const usePostgres = Boolean(process.env.DATABASE_URL);

// One connection, shared by Better Auth (\`driver\`) and your app (\`db\`).
// Postgres in production when DATABASE_URL is set, a local SQLite file otherwise.
export const driver = usePostgres
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new BetterSqlite3(path.resolve(process.cwd(), "../../dev.db"));

const dialect = usePostgres
  ? new PostgresDialect({ pool: driver as Pool })
  : new SqliteDialect({ database: driver as BetterSqlite3.Database });

export const db = new Kysely<DB>({ dialect });

export type Database = Kysely<DB>;`,
};
