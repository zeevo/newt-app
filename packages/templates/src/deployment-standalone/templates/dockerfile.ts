export default {
  filename: "Dockerfile",
  template: `FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
ARG API_HOST=localhost
ENV API_HOST=$API_HOST
RUN pnpm build --filter=web --filter=api --filter=@<%= projectName %>/auth
RUN pnpm deploy --filter=api --prod /deploy/api

# --- web ---
FROM base AS web
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# --- api ---
FROM base AS api
ENV NODE_ENV=production
COPY --from=build /deploy/api /app
WORKDIR /app
EXPOSE 3001
CMD ["node", "dist/main"]

# --- migrate ---
FROM build AS migrate
WORKDIR /app
CMD ["pnpm", "db:migrate"]`,
};
