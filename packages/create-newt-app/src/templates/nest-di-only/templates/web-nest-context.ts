export default {
  filename: "apps/web/lib/nest.ts",
  template: `import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@<%= projectName %>/api';
import type { INestApplicationContext, Type, Abstract } from '@nestjs/common';

let context: Promise<INestApplicationContext> | null = null;

export function getContext(): Promise<INestApplicationContext> {
  context ??= NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  return context;
}

export async function inject<T>(token: Type<T> | Abstract<T> | string | symbol): Promise<T> {
  const ctx = await getContext();
  return ctx.get<T>(token);
}`,
};
