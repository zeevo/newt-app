export default {
  filename: "apps/web/pages/api/[...path].ts",
  template: `import 'reflect-metadata';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { INestApplication } from '@nestjs/common';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

let app: INestApplication | null = null;

async function getApp(): Promise<INestApplication> {
  if (!app) {
    const { NestFactory } = await import(/* webpackIgnore: true */ '@nestjs/core');
    const { AppModule } = await import(/* webpackIgnore: true */ '@<%= projectName %>/api');
    app = await NestFactory.create(AppModule, { bodyParser: false });
    app.setGlobalPrefix('api');
    await app.init();
  }
  return app;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const nestApp = await getApp();
  const express = nestApp.getHttpAdapter().getInstance() as (
    req: NextApiRequest,
    res: NextApiResponse
  ) => void;
  express(req, res);
}`,
};
