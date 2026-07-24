export default {
  filename: "apps/web/lib/auth-client.ts",
  template: `import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient();`,
};
