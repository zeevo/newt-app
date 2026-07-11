import type { Module } from "../types";
import packageJson from "./templates/package-json";
import tsconfig from "./templates/tsconfig";
import srcIndex from "./templates/src-index";
import srcSchema from "./templates/src-schema";
import srcMigrate from "./templates/src-migrate";
import scriptsNewMigration from "./templates/scripts-new-migration";
import migrationsReadme from "./templates/migrations-readme";

const db: Module = {
  templates: [
    packageJson,
    tsconfig,
    srcIndex,
    srcSchema,
    srcMigrate,
    scriptsNewMigration,
    migrationsReadme,
  ],
};

export default db;
