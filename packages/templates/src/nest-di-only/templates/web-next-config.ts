export default {
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@<%= projectName %>/api',
    '@nestjs/core',
    '@nestjs/common',
    'reflect-metadata',
  ],
};

export default nextConfig;`,
};
