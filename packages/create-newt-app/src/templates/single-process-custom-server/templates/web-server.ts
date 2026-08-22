export default {
  filename: "apps/web/server.ts",
  template: `import 'reflect-metadata';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@<%= projectName %>/api';
import next from 'next';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT ?? '3000', 10);

async function main() {
  const nextApp = next({ dev, port });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const nestApp = await NestFactory.create(AppModule);
  // apps/api/src/main.ts never runs here, so its prefix is set again
  nestApp.setGlobalPrefix('api');
  await nestApp.init();

  const nestListener = nestApp
    .getHttpServer()
    .listeners('request')[0] as (req: IncomingMessage, res: ServerResponse) => void;

  const server = createServer((req, res) => {
    if (req.url?.startsWith('/api/')) {
      nestListener(req, res);
    } else {
      handle(req, res);
    }
  });

  server.listen(port, () => {
    console.log(\`> Server ready on http://localhost:\${port}\`);
  });
}

main().catch(console.error);`,
};
