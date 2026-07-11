export default {
  filename: "packages/auth/src/index.ts",
  template: `import { betterAuth } from "better-auth";
import { driver } from "@<%= projectName %>/db";

export const auth = betterAuth({
  database: driver,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});

export type Auth = typeof auth;`,
};
