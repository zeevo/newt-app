export default {
  filename: "apps/web/app/api/auth/[...all]/route.ts",
  template: `import { auth } from "@<%= projectName %>/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);`,
};
