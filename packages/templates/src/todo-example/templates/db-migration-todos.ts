export default {
  filename: "packages/db/src/migrations/0001_create_todos.ts",
  template: `import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("todo")
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("userId", "text", (c) => c.notNull())
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("done", "integer", (c) => c.notNull().defaultTo(0))
    .addColumn("createdAt", "text", (c) =>
      c.notNull().defaultTo(sql\`CURRENT_TIMESTAMP\`),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("todo").execute();
}`,
};
