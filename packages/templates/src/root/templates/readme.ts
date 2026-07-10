export default {
  filename: "README.md",
  template: `# <%= projectName %>

Full-stack monorepo: Next.js 16 + NestJS 11 + better-auth + PostgreSQL.

## Quick start

\`\`\`sh
cp .env.example .env   # fill in DATABASE_URL
pnpm install
pnpm db:migrate
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Apps

- **web**: Next.js frontend (port 3000)
- **api**: NestJS backend (port 3001)

## Packages

- **\`@<%= projectName %>/auth\`**: better-auth config
- **\`@<%= projectName %>/ui\`**: shared React components
- **\`@<%= projectName %>/eslint-config\`**: shared ESLint config
- **\`@<%= projectName %>/typescript-config\`**: shared tsconfig
`,
};
