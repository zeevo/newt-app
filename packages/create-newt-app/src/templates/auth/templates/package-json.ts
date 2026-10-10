export default {
  filename: "packages/auth/package.json",
  template: `{
  "name": "@<%= projectName %>/auth",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./options": "./src/options.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "migrate": "dotenv -e ../../.env -- auth migrate -y --config src/cli.ts",
    "generate": "dotenv -e ../../.env -- auth generate --config src/cli.ts"
  },
  "dependencies": {
    "@<%= projectName %>/db": "workspace:*",
    "auth": "<%= versions.auth %>",
    "better-auth": "<%= versions["better-auth"] %>"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "dotenv-cli": "<%= versions["dotenv-cli"] %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
