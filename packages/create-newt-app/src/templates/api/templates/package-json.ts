import type { Selection } from "../../types";
export default {
  when: (s: Selection) => !s.nestDiOnly && s.deployment !== "spa",
  filename: "apps/api/package.json",
  template: `{
  "name": "api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "nest build",
    "typecheck": "tsc -p tsconfig.build.json --noEmit",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "<%= versions["@nestjs/common"] %>",
    "@nestjs/core": "<%= versions["@nestjs/core"] %>",
    "@nestjs/platform-express": "<%= versions["@nestjs/platform-express"] %>",
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
    "@types/express": "<%= versions["@types/express"] %>",
    "@types/node": "<%= versions["@types/node"] %>",
    "@types/supertest": "<%= versions["@types/supertest"] %>",
    "supertest": "<%= versions.supertest %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
