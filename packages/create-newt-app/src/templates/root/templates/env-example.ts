export default {
  filename: ".env.example",
  template: `<% if (database === 'postgres') { %># Provided by \`docker compose up db\`
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
<% } else { %># SQLite database file, resolved from the repo root. Defaults to dev.db;
# set DATABASE_URL to an absolute path to use another file.
<% } %><% if (nest !== 'off') { %>
# Origin the api allows cross-origin requests from
CORS_ORIGIN=http://localhost:3000
# Port the api listens on
PORT=3001
<% } %><% if (deployment === 'standalone') { %>
# Host the web app proxies /api to at build time
API_HOST=localhost
<% } %>BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
`,
};
