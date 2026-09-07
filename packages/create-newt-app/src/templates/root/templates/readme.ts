export default {
  filename: "README.md",
  template: `# <%= projectName %>

Full-stack monorepo: Next.js 16<% if (nest !== 'off') { %> + NestJS 11<% } %> + better-auth + <%= database === 'postgres' ? 'Postgres' : 'SQLite' %>.

## Quick start

\`\`\`sh
<% if (database === 'postgres') { %># set DATABASE_URL in .env to your Postgres database
<% } %>pnpm install
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Apps

- **web**: Next.js frontend (port 3000)
<% if (nest === 'on') { -%>
- **api**: NestJS backend (port 3001)
<% } else if (nest === 'di-only') { -%>
- **api**: NestJS providers, resolved from the web process (no HTTP server)
<% } -%>

## Packages

- **\`@<%= projectName %>/auth\`**: better-auth config
- **\`@<%= projectName %>/db\`**: Kysely client and migrations
- **\`@<%= projectName %>/ui\`**: shared React components
<% if (linter === 'eslint') { -%>
- **\`@<%= projectName %>/eslint-config\`**: shared ESLint config
<% } -%>
- **\`@<%= projectName %>/typescript-config\`**: shared tsconfig
`,
};
