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
    "lint": "eslint --max-warnings 0 && next typegen && tsc --noEmit",
    "db:migrate": "better-auth migrate"
  },
  "dependencies": {
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/ui": "workspace:*",
    "@tailwindcss/postcss": "^4.2.1",
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
    "typescript": "6.0.2"
  }
}`,
};
