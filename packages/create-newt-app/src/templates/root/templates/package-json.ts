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
    "db:make": "pnpm --filter @<%= projectName %>/db run make",
    "db:migrate": "turbo run migrate",
    "db:generate": "turbo run generate"
  },
  "devDependencies": {
    "turbo": "<%= versions.turbo %>",
    "typescript": "<%= versions.typescript %>"
  },
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=18"
  }
}`,
};
