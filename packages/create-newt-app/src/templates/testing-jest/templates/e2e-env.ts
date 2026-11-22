export default {
  filename: "apps/api/test/e2e-env.ts",
  template: `import dotenv from 'dotenv';
import { resolve } from 'path';

// The e2e spec is the only entry point that does not go through src/main.ts,
// so it loads the same .env files itself. It is the spec's first import,
// because better-auth reads BETTER_AUTH_URL at module init.
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config({ path: resolve(process.cwd(), '.env') });
`,
};
