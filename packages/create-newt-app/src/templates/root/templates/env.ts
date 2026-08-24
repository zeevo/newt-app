export default {
  filename: ".env",
  template: `<% if (database === 'postgres') { %>DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
<% } else { %># Local SQLite database, written to dev.db at the repo root
<% } %>BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<%= authSecret %>
`,
};
