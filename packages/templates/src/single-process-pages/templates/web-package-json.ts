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
    "@<%= projectName %>/ui": "workspace:*",
    "@tailwindcss/postcss": "^4.2.1",
    "dotenv": "^17.3.1",
    "@tanstack/react-form": "^1.28.5",
    "@tanstack/react-query": "^5.90.21",
    "better-auth": "^1.2.8",
    "next": "16.2.10",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "typescript": "6.0.2"
  }
}`
};
