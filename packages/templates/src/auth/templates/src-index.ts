export default {
  filename: "packages/auth/src/index.ts",
  template: `import { betterAuth } from "better-auth";
import { Pool } from "pg";
import Database from "better-sqlite3";
import path from "node:path";

// Postgres when DATABASE_URL is set; otherwise a local SQLite file at the
// repo root so a fresh scaffold works with zero configuration.
const database = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Database(path.resolve(process.cwd(), "../../dev.db"));

export const auth = betterAuth({
  database,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});

export type Auth = typeof auth;`,
};
