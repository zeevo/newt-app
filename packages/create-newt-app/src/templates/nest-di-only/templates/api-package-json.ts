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
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "<%= versions["@nestjs/common"] %>",
    "@nestjs/core": "<%= versions["@nestjs/core"] %>",
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/db": "workspace:*",
    "@thallesp/nestjs-better-auth": "<%= versions["@thallesp/nestjs-better-auth"] %>",
    "dotenv": "<%= versions.dotenv %>",
    "reflect-metadata": "<%= versions["reflect-metadata"] %>",
    "rxjs": "<%= versions.rxjs %>"
  },
  "devDependencies": {
    "@nestjs/cli": "<%= versions["@nestjs/cli"] %>",
    "@nestjs/schematics": "<%= versions["@nestjs/schematics"] %>",
    "@nestjs/testing": "<%= versions["@nestjs/testing"] %>",
    "@types/node": "<%= versions["@types/node"] %>",
    "ts-node": "<%= versions["ts-node"] %>",
    "tsconfig-paths": "<%= versions["tsconfig-paths"] %>",
    "typescript": "<%= versions.typescript %>"
  }
}`
};
