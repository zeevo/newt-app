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
    "kysely": "^0.28.2",
    "pg": "^8.14.1"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/pg": "^8.11.13",
    "dotenv-cli": "^11.0.0",
    "tsx": "^4.19.2",
    "typescript": "6.0.2"
  }
}`,
};
