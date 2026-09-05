# my-app

Full-stack monorepo: Next.js 16 + NestJS 11 + better-auth + Postgres.

## Quick start

```sh
# set DATABASE_URL in .env to your Postgres database
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Apps

- **web**: Next.js frontend (port 3000)
- **api**: NestJS backend (port 3001)

## Packages

- **`@my-app/auth`**: better-auth config
- **`@my-app/db`**: Kysely client and migrations
- **`@my-app/ui`**: shared React components
- **`@my-app/typescript-config`**: shared tsconfig
