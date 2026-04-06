export default {
  filename: "apps/web/package.json",
  template: `{
  "name": "web",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx watch --tsconfig tsconfig.server.json server.ts",
    "build": "next build",
    "start": "next start",
    "lint": "eslint --max-warnings 0 && next typegen && tsc --noEmit",
    "db:migrate": "better-auth migrate"
  },
  "dependencies": {
    "@<%= projectName %>/api": "workspace:*",
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/ui": "workspace:*",
    "@tailwindcss/postcss": "^4.2.1",
    "dotenv": "^17.3.1",
    "@tanstack/react-form": "^1.28.5",
    "@tanstack/react-query": "^5.90.21",
    "better-auth": "^1.2.8",
    "next": "16.2.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@<%= projectName %>/eslint-config": "workspace:*",
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "eslint": "^9.39.1",
    "tsx": "^4.19.4",
    "typescript": "6.0.2"
  }
}`,
};
