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
    ".": {
      "default": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/graphql": "^13.0.0",
    "@nestjs/microservices": "^11.0.0",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/websockets": "^11.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "@<%= projectName %>/auth": "workspace:*",
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
    "@types/express": "^5.0.0",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "globals": "^16.0.0",
    "supertest": "^7.0.0",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "6.0.2",
    "typescript-eslint": "^8.20.0"
  }
}`,
};
