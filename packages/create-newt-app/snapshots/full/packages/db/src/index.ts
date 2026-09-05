import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./schema.js";

export const driver = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool: driver }),
});

export type Database = Kysely<DB>;