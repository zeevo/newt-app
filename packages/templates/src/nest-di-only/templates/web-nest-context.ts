export default {
  filename: "apps/web/lib/nest.ts",
  template: `import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@<%= projectName %>/api';
import type { INestApplicationContext } from '@nestjs/common';

declare global {
  // eslint-disable-next-line no-var
  var __nestApp: INestApplicationContext | undefined;
}

export async function getNestApp(): Promise<INestApplicationContext> {
  if (!global.__nestApp) {
    global.__nestApp = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });
  }
  return global.__nestApp;
}`,
};
