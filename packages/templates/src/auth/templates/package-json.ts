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
    "migrate": "dotenv -e ../../.env -- auth migrate -y --config src/index.ts",
    "generate": "dotenv -e ../../.env -- auth generate --config src/index.ts"
  },
  "dependencies": {
    "@<%= projectName %>/db": "workspace:*",
    "auth": "^1.5.5",
    "better-auth": "^1.2.8"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "dotenv-cli": "^11.0.0",
    "typescript": "6.0.2"
  }
}`,
};
