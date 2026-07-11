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
    "lint": "eslint \\"src/**/*.ts\\" --fix",
    "lint:check": "eslint \\"src/**/*.ts\\""
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/db": "workspace:*",
    "@thallesp/nestjs-better-auth": "^2.5.1",
    "dotenv": "^17.3.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@types/node": "^22.10.7",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "globals": "^16.0.0",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "6.0.2",
    "typescript-eslint": "^8.20.0"
  }
}`,
};
