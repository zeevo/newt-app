export default {
  filename: "apps/api/package.json",
  template: `{
  "name": "@<%= projectName %>/api",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "<%= versions["@nestjs/common"] %>",
    "@nestjs/core": "<%= versions["@nestjs/core"] %>",
    "@nestjs/platform-express": "<%= versions["@nestjs/platform-express"] %>",
    "@<%= projectName %>/auth": "workspace:*",
    "@thallesp/nestjs-better-auth": "<%= versions["@thallesp/nestjs-better-auth"] %>",
    "dotenv": "<%= versions.dotenv %>",
    "reflect-metadata": "<%= versions["reflect-metadata"] %>",
    "rxjs": "<%= versions.rxjs %>"
  },
  "devDependencies": {
    "@nestjs/cli": "<%= versions["@nestjs/cli"] %>",
    "@nestjs/schematics": "<%= versions["@nestjs/schematics"] %>",
    "@nestjs/testing": "<%= versions["@nestjs/testing"] %>",
    "@types/express": "<%= versions["@types/express"] %>",
    "@types/node": "<%= versions["@types/node"] %>",
    "@types/supertest": "<%= versions["@types/supertest"] %>",
    "supertest": "<%= versions.supertest %>",
    "ts-node": "<%= versions["ts-node"] %>",
    "tsconfig-paths": "<%= versions["tsconfig-paths"] %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
