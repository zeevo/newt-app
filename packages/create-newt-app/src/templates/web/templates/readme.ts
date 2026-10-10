export default {
  filename: "apps/web/README.md",
  template: `# <%= projectName %> / web

The Next.js frontend. It runs on port 3000 in development.

\`\`\`sh
pnpm dev
\`\`\`

<% if (nest === 'on') { -%>
In development, requests to \`/api/*\` are rewritten to the NestJS backend at
\`http://localhost:3001\` (see \`next.config.js\`). Run the backend with \`pnpm dev\`
from the repo root.
<% } else if (nest === 'di-only') { -%>
API routes are served in-process by Next.js route handlers that resolve NestJS
providers directly — there is no separate backend process.
<% } else { -%>
There is no backend; API routes are served in-process by Next.js route handlers.
<% } -%>

## Scripts

- \`pnpm dev\` — run the dev server on port 3000
- \`pnpm build\` — production build
- \`pnpm start\` — serve the production build
- \`pnpm typecheck\` — type-check the app
`,
};
