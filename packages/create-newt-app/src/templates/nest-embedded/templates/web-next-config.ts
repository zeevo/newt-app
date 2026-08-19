import type { Selection } from "../../types";
export default {
  when: (s) => s.deployment !== "standalone",
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

// No /api rewrite: Nest runs inside this process, so pages/api/[[...path]].ts
// serves /api itself and there is no separate api server to proxy to.
/** @type {import('next').NextConfig} */
const nextConfig = {
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
