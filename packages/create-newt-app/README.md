<div align="center">
  <h1>newt-app</h1>
  <p><strong>Scaffold a production-ready, full-stack TypeScript monorepo in one command.</strong></p>

<a href="https://www.npmjs.com/package/create-newt-app"><img alt="npm version" src="https://img.shields.io/npm/v/create-newt-app.svg?style=for-the-badge&labelColor=000000"></a>

</div>

## Getting Started

```sh
npm create newt-app
```

This scaffolds a Next.js and NestJS monorepo with Better Auth, a typed Kysely database, and shadcn/ui — all wired together with Turborepo and pnpm, so you start on features instead of plumbing.

## Documentation

Visit [newt-app.vercel.app](https://newt-app.vercel.app) to view the full documentation.

## What's inside

- **Next.js** frontend and **NestJS** backend, with `/api` proxied server-side to Nest
- **Better Auth** shared across both apps
- **Kysely** persistence, on SQLite or Postgres
- **shadcn/ui** component library
- **Turborepo** + **pnpm** workspaces
