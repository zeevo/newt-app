export default {
  filename: "README.md",
  template: `# <%= projectName %>

Full-stack monorepo: Next.js 16 + <% if (mode !== 'bare') { %>NestJS 11 + <% } %>better-auth + <%= database === 'postgres' ? 'Postgres' : 'SQLite' %>.

## Quick start

\`\`\`sh
<% if (database === 'postgres') { %># set DATABASE_URL in .env to your Postgres database
<% } %>pnpm install
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Apps

- **web**: Next.js frontend (port 3000)
<% if (mode !== 'bare') { %>- **api**: NestJS backend (port 3001)
<% } %>
## Packages

- **\`@<%= projectName %>/auth\`**: better-auth config
- **\`@<%= projectName %>/ui\`**: shared React components
- **\`@<%= projectName %>/eslint-config\`**: shared ESLint config
- **\`@<%= projectName %>/typescript-config\`**: shared tsconfig
`,
};
