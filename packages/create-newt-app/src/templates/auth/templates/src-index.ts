export default {
  filename: "packages/auth/src/index.ts",
  template: `import { betterAuth } from "better-auth";
import { driver } from "@<%= projectName %>/db";

const migrating = process.argv.includes("migrate");

export const auth = betterAuth({
  database: driver,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  logger: migrating ? { disabled: true } : undefined,
});

export type Auth = typeof auth;`,
};
