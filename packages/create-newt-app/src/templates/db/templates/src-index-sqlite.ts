export default {
  filename: "packages/db/src/index.ts",
  template: `import BetterSqlite3 from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import fs from "node:fs";
import path from "node:path";
import type { DB } from "./schema.js";

// The database belongs to the project, not to whoever started the process.
// cwd differs per caller: packages/db when migrating, apps/web under dev or
// start, and the project root under a standalone build, so a fixed number of
// ".." segments silently opens a different, empty database in some of them.
// Walk up to the workspace root instead. import.meta.url would be the obvious
// anchor, but this file is also compiled to CommonJS for the NestJS api, where
// it is a TS1470 error.
function projectRoot(from: string) {
  for (let dir = from; ; ) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return from;
    dir = parent;
  }
}

export const driver = new BetterSqlite3(
  path.join(projectRoot(process.cwd()), "dev.db"),
);

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({ database: driver }),
});

export type Database = Kysely<DB>;`,
};
