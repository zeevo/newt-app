export default {
  filename: "README.md",
  template: `# <%= projectName %>

Full-stack monorepo: Next.js 16<% if (nest !== 'off') { %> + NestJS 12<% } %> + better-auth + <%= database === 'postgres' ? 'Postgres' : 'SQLite' %>.

## Quick start

\`\`\`sh
<% if (database === 'postgres') { %># set DATABASE_URL in .env to your Postgres database
<% } %>pnpm install
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).
<% if (deployment === 'none') { -%>

## Production

\`\`\`sh
pnpm db:migrate
pnpm build
pnpm --filter @<%= projectName %>/web start
\`\`\`

Open [http://localhost:3000](http://localhost:3000).
<% } else if (deployment === 'spa') { -%>

## Production

NestJS serves the static export and the API from one origin, so point \`BETTER_AUTH_URL\` at it:

\`\`\`sh
pnpm db:migrate
pnpm build
cd apps/api
BETTER_AUTH_URL=http://localhost:3001 pnpm start:prod
\`\`\`

Open [http://localhost:3001](http://localhost:3001). In a real deployment, set \`BETTER_AUTH_URL\` to the public URL.
<% } else if (deployment === 'standalone') { -%>

## Production

\`docker-compose.yml\` builds and runs the app; the \`migrate\` service applies migrations before the app starts:

\`\`\`sh
docker compose up --build
\`\`\`

Open [http://localhost:3000](http://localhost:3000). Set \`BETTER_AUTH_URL\` to the public URL in a real deployment.
<% } -%>

## Commands

- \`pnpm dev\` — run the app in development
- \`pnpm build\` — build every workspace
- \`pnpm typecheck\` — type-check every workspace
- \`pnpm test\` — run the unit tests
- \`pnpm lint:check\` — lint without fixing (fails on errors)
- \`pnpm format\` / \`pnpm format:fix\` — check / apply formatting
- \`pnpm db:migrate\` — run migrations; \`pnpm db:make <name>\` scaffolds a new one

## Environment

Values live in \`.env\` (a committed \`.env.example\` documents each one):

- **BETTER_AUTH_URL** — the public origin of the app
- **BETTER_AUTH_SECRET** — a random secret used to sign sessions
<% if (database === 'postgres') { -%>
- **DATABASE_URL** — your Postgres connection string
<% } else { -%>
- **DATABASE_URL** — not set for SQLite; the app uses a local file at the repo root (\`dev.db\`). Set it to a Postgres URL to use Postgres.
<% } -%>

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

## Formatting

\`pnpm format\` checks without modifying files and fails if any file is unformatted; \`pnpm format:fix\` applies formatting.
`,
};
