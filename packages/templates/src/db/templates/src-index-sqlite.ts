export default {
  filename: "packages/db/src/index.ts",
  template: `import BetterSqlite3 from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import path from "node:path";
import type { DB } from "./schema.js";

// Local SQLite file (dev.db at the repo root), shared by Better Auth (\`driver\`)
// and your app (\`db\`).
export const driver = new BetterSqlite3(
  path.resolve(process.cwd(), "../../dev.db"),
);

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({ database: driver }),
});

export type Database = Kysely<DB>;`,
};
