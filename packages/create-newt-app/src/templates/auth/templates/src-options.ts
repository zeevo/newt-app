export default {
  filename: "packages/auth/src/options.ts",
  template: `import type { BetterAuthOptions } from "better-auth";
import { driver } from "@<%= projectName %>/db";

export const options = {
  database: driver,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
} satisfies BetterAuthOptions;`,
};
