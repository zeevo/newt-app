export default {
  filename: "packages/auth/src/index.ts",
  template: `import { betterAuth } from "better-auth";
import { options } from "@<%= projectName %>/auth/options";

export const auth = betterAuth(options);

export type Auth = typeof auth;`,
};
