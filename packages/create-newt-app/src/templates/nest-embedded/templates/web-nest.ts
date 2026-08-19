export default {
  filename: "apps/web/lib/nest.ts",
  template: `import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { createNest } from '@newt-app/nest-next';
import { AppModule } from '@<%= projectName %>/api';

export const nest = createNest(async () => {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: false,
  });
  app.setGlobalPrefix('api');
  await app.init();
  return app;
});`,
};
