export default {
  filename: "packages/db/scripts/new-migration.ts",
  template: `import { promises as fs } from "node:fs";
import path from "node:path";

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error("Usage: pnpm db:make <name>");
    process.exit(1);
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);
  const slug = name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const filename = timestamp + "_" + slug + ".ts";
  const dir = path.join(process.cwd(), "src/migrations");
  const stub = [
    'import { Kysely, sql } from "kysely";',
    "",
    "export async function up(db: Kysely<any>): Promise<void> {",
    "  // await db.schema.createTable(...).execute();",
    "}",
    "",
    "export async function down(db: Kysely<any>): Promise<void> {",
    "  // await db.schema.dropTable(...).execute();",
    "}",
    "",
  ].join("\\n");

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), stub);
  console.log("created src/migrations/" + filename);
}

main();`,
};
