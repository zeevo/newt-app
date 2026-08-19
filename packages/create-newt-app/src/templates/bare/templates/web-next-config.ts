import type { Selection } from "../../types";
export default {
  when: (s) => s.mode === "bare",
  filename: "apps/web/next.config.js",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first, then local .env (local takes precedence)
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`,
};
