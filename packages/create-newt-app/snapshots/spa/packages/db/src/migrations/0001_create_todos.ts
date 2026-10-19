import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("todo")
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("userId", "text", (c) => c.notNull())
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("done", "integer", (c) => c.notNull().defaultTo(0))
    // App-set ISO 8601, like the auth tables; a CURRENT_TIMESTAMP default
    // would store "YYYY-MM-DD HH:MM:SS" and sort inconsistently with it.
    .addColumn("createdAt", "text", (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("todo").execute();
}