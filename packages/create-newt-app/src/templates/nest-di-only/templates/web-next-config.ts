import type { Selection } from "../../types";
export default {
  when: (s) => s.deployment !== "standalone",
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@<%= projectName %>/api',
    '@newt-app/nest-next-adapter',
    '@<%= projectName %>/db',
    '@nestjs/core',
    '@nestjs/platform-express',
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
