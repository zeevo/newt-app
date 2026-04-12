export default {
  filename: "apps/web/lib/nest.ts",
  template: `import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@<%= projectName %>/api';
import type { INestApplicationContext } from '@nestjs/common';

const nestApp: Promise<INestApplicationContext> = NestFactory.createApplicationContext(AppModule, { logger: false });

export function getNestApp(): Promise<INestApplicationContext> {
  return nestApp;
}`,
};
