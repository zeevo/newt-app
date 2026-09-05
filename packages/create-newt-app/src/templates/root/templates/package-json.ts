export default {
  filename: "package.json",
  template: `{
  "name": "<%= projectName %>",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "db:make": "pnpm --filter @<%= projectName %>/db run make",
    "db:migrate": "turbo run migrate",
    "db:generate": "turbo run generate"
  },
  "devDependencies": {
    "@types/node": "<%= versions["@types/node"] %>",
    "turbo": "<%= versions.turbo %>",
    "typescript": "<%= versions.typescript %>"
  },
  "packageManager": "pnpm@11.25.0",
  "engines": {
    "node": ">=24.0.0"
  }
}`,
};
