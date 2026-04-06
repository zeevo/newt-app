export default {
  filename: "Dockerfile",
  template: `FROM node:22-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
RUN pnpm install --frozen-lockfile

# --- web ---
FROM base AS web-builder
WORKDIR /app
ARG API_HOST=localhost
ENV API_HOST=$API_HOST
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter=web

FROM base AS web
WORKDIR /app
ENV NODE_ENV=production
COPY --from=web-builder /app/apps/web/.next/standalone ./
COPY --from=web-builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# --- api ---
FROM base AS api-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter=api

FROM base AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=api-builder /app/apps/api/dist ./apps/api/dist
COPY --from=api-builder /app/node_modules ./node_modules
COPY --from=api-builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=api-builder /app/packages/auth ./packages/auth
WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/main"]

# --- migrate ---
FROM base AS migrate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/auth/node_modules ./packages/auth/node_modules
COPY packages/auth ./packages/auth
COPY packages/typescript-config ./packages/typescript-config
WORKDIR /app/packages/auth
CMD ["/app/packages/auth/node_modules/.bin/auth", "migrate", "--config", "src/index.ts", "-y"]`,
};
