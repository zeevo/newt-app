import type { Selection } from "../../types";
export default {
  when: (s: Selection) => !s.nestDiOnly,
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env'), quiet: true });
dotenv.config({ path: resolve(process.cwd(), '.env'), quiet: true });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: \`http://\${process.env.API_HOST ?? 'localhost'}:3001/api/:path*\`,
      },
    ];
  },
};

export default nextConfig;`,
};
