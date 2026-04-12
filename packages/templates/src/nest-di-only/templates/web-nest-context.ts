export default {
  filename: "apps/web/lib/nest.ts",
  template: `import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@<%= projectName %>/api';
import type { INestApplicationContext } from '@nestjs/common';

declare global {
  // eslint-disable-next-line no-var
  var __nestApp: Promise<INestApplicationContext> | undefined;
}

global.__nestApp ??= NestFactory.createApplicationContext(AppModule, { logger: false });

export function getNestApp(): Promise<INestApplicationContext> {
  return global.__nestApp!;
}`,
};
