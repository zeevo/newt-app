export default {
  filename: "packages/db/package.json",
  template: `{
  "name": "@<%= projectName %>/db",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "migrate": "dotenv -e ../../.env -- tsx src/migrate.ts",
    "make": "tsx scripts/new-migration.ts"
  },
  "dependencies": {
    "better-sqlite3": "<%= versions["better-sqlite3"] %>",
    "kysely": "<%= versions.kysely %>"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/better-sqlite3": "<%= versions["@types/better-sqlite3"] %>",
    "dotenv-cli": "<%= versions["dotenv-cli"] %>",
    "tsx": "<%= versions.tsx %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
