export default {
  filename: "packages/auth/package.json",
  template: `{
  "name": "@<%= projectName %>/auth",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "migrate": "dotenv -e ../../.env -- auth migrate --config src/index.ts",
    "generate": "dotenv -e ../../.env -- auth generate --config src/index.ts"
  },
  "dependencies": {
    "auth": "^1.5.5",
    "better-auth": "^1.2.8",
    "better-sqlite3": "^12.11.1",
    "pg": "^8.14.1"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/better-sqlite3": "^7.6.13",
    "@types/pg": "^8.11.13",
    "dotenv-cli": "^11.0.0",
    "typescript": "6.0.2"
  }
}`,
};
