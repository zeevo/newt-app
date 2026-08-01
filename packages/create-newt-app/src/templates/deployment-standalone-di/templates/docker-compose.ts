export default {
  filename: "docker-compose.yml",
  template: `x-app-env: &app-env
  BETTER_AUTH_SECRET: \${BETTER_AUTH_SECRET}
  DATABASE_URL: postgresql://postgres:\${POSTGRES_PASSWORD:-postgres}@db:5432/postgres

services:
  web:
    build:
      context: .
      target: web
    ports:
      - "3000:3000"
    environment:
      <<: *app-env
    depends_on:
      db:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully

  migrate:
    build:
      context: .
      target: migrate
    environment:
      <<: *app-env
    depends_on:
      db:
        condition: service_healthy
    restart: "no"

  db:
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

volumes:
  db_data:`,
};
