export default {
  filename: "packages/db/src/index.ts",
  template: `import BetterSqlite3 from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import fs from "node:fs";
import path from "node:path";
import type { DB } from "./schema.js";

function projectRoot(from: string) {
  for (let dir = from; ; ) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return from;
    dir = parent;
  }
}

export const databaseFile =
  process.env.DATABASE_URL ?? path.join(projectRoot(process.cwd()), "dev.db");

export const driver = new BetterSqlite3(databaseFile);

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({ database: driver }),
});

export type Database = Kysely<DB>;`,
};
