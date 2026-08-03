import type { Selection } from "../../types";
export default {
  when: (s) => !s.nestDiOnly,
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

// No output setting: server.ts is the server, so Next runs in-process rather
// than through its own standalone entrypoint.
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`,
};
