export default {
  filename: "docker-compose.yml",
  template: `x-app-env: &app-env
  BETTER_AUTH_SECRET: \${BETTER_AUTH_SECRET}
  # Better Auth trusts this origin; without it every deployment falls back to
  # localhost:3000 and rejects requests from the real one.
  BETTER_AUTH_URL: \${BETTER_AUTH_URL:-http://localhost:3000}
<% if (database === 'postgres') { %>  DATABASE_URL: postgresql://postgres:\${POSTGRES_PASSWORD:-postgres}@db:5432/postgres
<% } else { %>  DATABASE_URL: /data/app.db
<% } %>
services:
  web:
    build:
      context: .
      target: web
    ports:
      - "3000:3000"
    environment:
      <<: *app-env
<% if (database === 'sqlite') { %>    volumes:
      - db_data:/data
<% } -%>
    depends_on:
<% if (database === 'postgres') { %>      db:
        condition: service_healthy
<% } -%>
      migrate:
        condition: service_completed_successfully

  migrate:
    build:
      context: .
      target: migrate
    environment:
      <<: *app-env
<% if (database === 'postgres') { %>    depends_on:
      db:
        condition: service_healthy
<% } else { %>    volumes:
      - db_data:/data
<% } -%>
    restart: "no"

<% if (database === 'postgres') { %>  db:
    image: postgres:17-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD:-postgres}
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

<% } -%>
volumes:
  db_data:`,
};
