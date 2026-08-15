export default {
  filename: "apps/web/package.json",
  template: `{
  "name": "web",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "db:migrate": "better-auth migrate"
  },
  "dependencies": {
    "@<%= projectName %>/api": "workspace:*",
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/db": "workspace:*",
    "@<%= projectName %>/ui": "workspace:*",
    "@nestjs/common": "<%= versions["@nestjs/common"] %>",
    "@nestjs/core": "<%= versions["@nestjs/core"] %>",
    "reflect-metadata": "<%= versions["reflect-metadata"] %>",
    "@tailwindcss/postcss": "<%= versions["@tailwindcss/postcss"] %>",
    "dotenv": "<%= versions.dotenv %>",
    "@tanstack/react-form": "<%= versions["@tanstack/react-form"] %>",
    "@tanstack/react-query": "<%= versions["@tanstack/react-query"] %>",
    "better-auth": "<%= versions["better-auth"] %>",
    "next": "<%= versions.next %>",
    "react": "<%= versions.react %>",
    "react-dom": "<%= versions["react-dom"] %>",
    "tailwindcss": "<%= versions.tailwindcss %>"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/node": "<%= versions["@types/node"] %>",
    "@types/react": "<%= versions["@types/react"] %>",
    "@types/react-dom": "<%= versions["@types/react-dom"] %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
