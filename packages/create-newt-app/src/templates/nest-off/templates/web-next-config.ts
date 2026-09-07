import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.deployment === "none",
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

// No /api rewrite: there is no second process, so Next serves /api itself.
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`,
};
