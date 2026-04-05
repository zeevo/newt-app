export default {
  filename: ".env",
  template: `DATABASE_URL=postgresql://user:password@localhost:5432/dbname
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here`,
};
