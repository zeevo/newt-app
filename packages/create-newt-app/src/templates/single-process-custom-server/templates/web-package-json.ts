export default {
  filename: "apps/web/package.json",
  template: `{
  "name": "web",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx watch --tsconfig tsconfig.server.json server.ts",
    "build": "next build && tsc -p tsconfig.server.json",
    "start": "node dist/server.js",
    "db:migrate": "better-auth migrate"
  },
  "dependencies": {
    "@<%= projectName %>/api": "workspace:*",
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/ui": "workspace:*",
    "@nestjs/core": "<%= versions["@nestjs/core"] %>",
    "@tailwindcss/postcss": "<%= versions["@tailwindcss/postcss"] %>",
    "dotenv": "<%= versions.dotenv %>",
    "@tanstack/react-form": "<%= versions["@tanstack/react-form"] %>",
    "@tanstack/react-query": "<%= versions["@tanstack/react-query"] %>",
    "better-auth": "<%= versions["better-auth"] %>",
    "next": "<%= versions.next %>",
    "react": "<%= versions.react %>",
    "react-dom": "<%= versions["react-dom"] %>",
    "reflect-metadata": "<%= versions["reflect-metadata"] %>",
    "tailwindcss": "<%= versions.tailwindcss %>"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/node": "<%= versions["@types/node"] %>",
    "@types/react": "<%= versions["@types/react"] %>",
    "@types/react-dom": "<%= versions["@types/react-dom"] %>",
    "tsx": "<%= versions.tsx %>",
    "typescript": "<%= versions.typescript %>"
  }
}`
};
