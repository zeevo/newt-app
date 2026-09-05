import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@my-app/api';
import type { INestApplicationContext, Type, Abstract } from '@nestjs/common';

let context: INestApplicationContext | null = null;

export async function getContext(): Promise<INestApplicationContext> {
  if (!context) {
    context = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });
  }
  return context;
}

export async function inject<T>(token: Type<T> | Abstract<T> | string | symbol): Promise<T> {
  const ctx = await getContext();
  return ctx.get<T>(token);
}