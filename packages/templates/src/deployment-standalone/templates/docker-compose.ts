export default {
  filename: "docker-compose.yml",
  template: `services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      args:
        - API_HOST=api
    ports:
      - "3000:3000"
    environment:
      - BETTER_AUTH_SECRET=\${BETTER_AUTH_SECRET}
      - DATABASE_URL=postgresql://postgres:\${POSTGRES_PASSWORD:-postgres}@db:5432/postgres
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - BETTER_AUTH_SECRET=\${BETTER_AUTH_SECRET}
      - DATABASE_URL=postgresql://postgres:\${POSTGRES_PASSWORD:-postgres}@db:5432/postgres
    depends_on:
      db:
        condition: service_healthy

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
