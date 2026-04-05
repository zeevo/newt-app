export default {
  filename: "apps/api/src/main.ts",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api');
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();`,
};
