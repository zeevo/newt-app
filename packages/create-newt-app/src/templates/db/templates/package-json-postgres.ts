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
    "typecheck": "tsc --noEmit",
    "migrate": "dotenv -e ../../.env -- tsx src/migrate.ts",
    "make": "tsx scripts/new-migration.ts"
  },
  "dependencies": {
    "kysely": "<%= versions.kysely %>",
    "pg": "<%= versions.pg %>"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/pg": "<%= versions["@types/pg"] %>",
    "dotenv-cli": "<%= versions["dotenv-cli"] %>",
    "tsx": "<%= versions.tsx %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
