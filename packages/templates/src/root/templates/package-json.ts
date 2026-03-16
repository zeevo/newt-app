export default {
  filename: "package.json",
  template: `{
  "name": "<%= projectName %>",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \\"**/*.{ts,tsx,js,jsx,json,md,yaml,yml}\\"",
    "format:check": "prettier --check \\"**/*.{ts,tsx,js,jsx,json,md,yaml,yml}\\"",
    "check-types": "turbo run check-types",
    "db:migrate": "turbo run migrate",
    "db:generate": "turbo run generate"
  },
  "devDependencies": {
    "prettier": "^3.7.4",
    "turbo": "^2.8.16",
    "typescript": "5.9.2"
  },
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=18"
  }
}`,
};
