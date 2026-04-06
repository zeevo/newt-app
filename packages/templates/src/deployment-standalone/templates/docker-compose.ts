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
      - DATABASE_URL=\${DATABASE_URL}
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
      - DATABASE_URL=\${DATABASE_URL}`,
};
