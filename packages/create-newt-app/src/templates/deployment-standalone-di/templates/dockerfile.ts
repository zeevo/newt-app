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
RUN pnpm build --filter=web --filter=@<%= projectName %>/api --filter=@<%= projectName %>/auth

# --- web ---
# DI-only has no api entrypoint: Nest is wired into this image through the
# Next.js server, so there is no separate api stage.
FROM base AS web
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# --- migrate ---
FROM build AS migrate
WORKDIR /app
CMD ["pnpm", "db:migrate"]`,
};
