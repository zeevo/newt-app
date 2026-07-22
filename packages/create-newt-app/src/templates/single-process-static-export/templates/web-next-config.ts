export default {
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export in production — served by NestJS via ServeStaticModule.
  // rewrites() is incompatible with output: "export", so dev uses the proxy
  // and production uses the static files.
  ...(isProduction
    ? { output: 'export' }
    : {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: 'http://localhost:3001/api/:path*',
            },
          ];
        },
      }),
};

export default nextConfig;`,
};
