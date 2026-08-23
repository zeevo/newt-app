export default {
  filename: "apps/api/README.md",
  template: `# API

NestJS backend for the monorepo.

## Scripts

\`\`\`sh
pnpm dev          # watch mode
pnpm build        # production build
pnpm test         # unit tests<% if (!nestDiOnly) { %>
pnpm test:e2e     # e2e tests<% } %>
\`\`\``,
};
