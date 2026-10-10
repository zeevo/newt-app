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
pnpm db:migrate && pnpm build
pnpm --filter @<%= projectName %>/web start
\`\`\`

Open [http://localhost:3000](http://localhost:3000).
<% } else if (deployment === 'spa') { -%>

## Production

NestJS serves the static export and the API from one origin, so point \`BETTER_AUTH_URL\` at it:

\`\`\`sh
pnpm db:migrate && pnpm build
cd apps/api
BETTER_AUTH_URL=http://localhost:3001 pnpm start:prod
\`\`\`

Open [http://localhost:3001](http://localhost:3001). In a real deployment, set \`BETTER_AUTH_URL\` to the public URL.
<% } else if (deployment === 'standalone') { -%>

## Production

\`\`\`sh
docker compose up --build
\`\`\`

The \`migrate\` service applies migrations before the app starts. Open [http://localhost:3000](http://localhost:3000); set \`BETTER_AUTH_URL\` to the public URL in a real deployment.
<% } -%>

## Commands

- \`pnpm dev\` — run in development
- \`pnpm build\`, \`pnpm typecheck\`, \`pnpm test\` — build, type-check, and test every workspace
- \`pnpm lint:check\` — lint (fails on errors); \`pnpm format:fix\` — apply formatting
- \`pnpm db:migrate\` — run migrations; \`pnpm db:make <name>\` — scaffold a new one
<% if (nest === 'on') { -%>
- \`pnpm --filter @<%= projectName %>/api test:e2e\` — run the e2e suite
<% } -%>

## Environment

Set in \`.env\` (a committed \`.env.example\` documents each one):

- **BETTER_AUTH_URL** — the public origin of the app
- **BETTER_AUTH_SECRET** — a random secret used to sign sessions
<% if (database === 'postgres') { -%>
- **DATABASE_URL** — your Postgres connection string
<% } else { -%>
- **DATABASE_URL** — not set for SQLite (the app uses \`dev.db\` at the repo root); set it to a Postgres URL to use Postgres
<% } -%>

## Layout

- **\`apps/web\`** — Next.js frontend (port 3000)
<% if (nest === 'on') { -%>
- **\`apps/api\`** — NestJS backend (port 3001)
<% } else if (nest === 'di-only') { -%>
- **\`apps/api\`** — NestJS providers, resolved in-process by the web app
<% } -%>
- **\`packages/\`** — \`auth\`, \`db\`, \`ui\`<% if (linter === 'eslint') { %>, \`eslint-config\`<% } %>, and shared \`typescript-config\`
`,
};
