export default {
  filename: "packages/auth/src/index.ts",
  template: `import { betterAuth } from "better-auth";
import { driver } from "@<%= projectName %>/db";

// Better Auth shares the same connection as the rest of the app (see
// packages/db). It owns the auth tables; run \`pnpm db:generate\` after changing
// auth config, then \`pnpm db:migrate\` applies both auth and app migrations.
export const auth = betterAuth({
  database: driver,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});

export type Auth = typeof auth;`,
};
