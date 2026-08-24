import type { Selection } from "../../types";
export default {
  when: (s: Selection) => !s.nestDiOnly,
  filename: "Dockerfile",
  template: `FROM node:24-alpine AS base
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
FROM build AS api
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main"]

# --- migrate ---
FROM build AS migrate
WORKDIR /app
CMD ["pnpm", "db:migrate"]`,
};
