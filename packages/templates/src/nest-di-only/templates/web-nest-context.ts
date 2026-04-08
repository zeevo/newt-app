export default {
  filename: "apps/web/lib/nest.ts",
  template: `import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@<%= projectName %>/api';
import type { INestApplicationContext } from '@nestjs/common';

let context: INestApplicationContext | null = null;

export async function getNestApp(): Promise<INestApplicationContext> {
  if (!context) {
    context = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });
  }
  return context;
}`,
};
