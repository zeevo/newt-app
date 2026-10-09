<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/zeevo/newt-app/main/.github/assets/logo-dark.svg">
    <img src="https://raw.githubusercontent.com/zeevo/newt-app/main/.github/assets/logo-light.svg" alt="newt-app" width="120">
  </picture>

  <h1>newt-app</h1>
  <p><strong>Scaffold a production-ready, full-stack TypeScript monorepo in one command.</strong></p>

<a href="https://www.npmjs.com/package/create-newt-app"><img alt="npm version" src="https://img.shields.io/npm/v/create-newt-app?style=flat-square"></a>

</div>

## Getting Started

```sh
npm create newt-app
```

Next.js and NestJS in one production-grade monorepo: a real backend, auth, and a database, curated so you're not deleting half of it on day one.

## Options

Run `npm create newt-app -- --help` for every flag, or build a command at [newt-app.com](https://newt-app.com).

## What's inside

- **Next.js** frontend and **NestJS** backend, with `/api` proxied server-side to Nest
- **Better Auth** shared across both apps
- **Kysely** persistence, on SQLite or Postgres
- Optional **shadcn/ui** component library
- **Turborepo** + **pnpm** workspaces
