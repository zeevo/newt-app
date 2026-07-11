import type { Module } from "../types";
import tsconfig from "./templates/tsconfig";
import srcSchema from "./templates/src-schema";
import srcMigrate from "./templates/src-migrate";
import scriptsNewMigration from "./templates/scripts-new-migration";
import migrationsReadme from "./templates/migrations-readme";
import packageJsonSqlite from "./templates/package-json-sqlite";
import packageJsonPostgres from "./templates/package-json-postgres";
import srcIndexSqlite from "./templates/src-index-sqlite";
import srcIndexPostgres from "./templates/src-index-postgres";

// Shared across both databases: schema, migration runner + generator, tsconfig.
const shared = [
  tsconfig,
  srcSchema,
  srcMigrate,
  scriptsNewMigration,
  migrationsReadme,
];

export const dbSqlite: Module = {
  templates: [...shared, packageJsonSqlite, srcIndexSqlite],
};

export const dbPostgres: Module = {
  templates: [...shared, packageJsonPostgres, srcIndexPostgres],
};
