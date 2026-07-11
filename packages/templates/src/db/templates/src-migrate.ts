export default {
  filename: "packages/db/src/migrate.ts",
  template: `import { promises as fs } from "node:fs";
import path from "node:path";
import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "./index.js";

// Applies every pending migration in ./migrations to the connected database
// (SQLite in dev, Postgres when DATABASE_URL is set). Run with \`pnpm db:migrate\`.
async function main() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), "src/migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  for (const it of results ?? []) {
    if (it.status === "Success") {
      console.log("applied " + it.migrationName);
    } else if (it.status === "Error") {
      console.error("failed " + it.migrationName);
    }
  }

  if (error) {
    console.error("migration failed");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

main();`,
};
