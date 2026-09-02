export default {
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env'), quiet: true });
dotenv.config({ path: resolve(process.cwd(), '.env'), quiet: true });

// No /api rewrite: DI-only runs Nest inside this process, so Next serves
// /api itself and there is no separate api container to proxy to.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: [
    '@<%= projectName %>/api',
    '@<%= projectName %>/db',
    '@nestjs/core',
    '@nestjs/common',
    '@nestjs/microservices',
    '@nestjs/websockets',
    '@thallesp/nestjs-better-auth',
    'reflect-metadata',
    'express',
  ],
};

export default nextConfig;`,
};
