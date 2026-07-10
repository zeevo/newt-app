export default {
  filename: ".env",
  template: `# Uses a local SQLite file (dev.db) unless DATABASE_URL is set
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here`,
};
