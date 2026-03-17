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
    "lint": "eslint --max-warnings 0",
    "check-types": "next typegen && tsc --noEmit",
    "db:migrate": "better-auth migrate"
  },
  "dependencies": {
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/ui": "workspace:*",
    "@tailwindcss/postcss": "^4.2.1",
    "@tanstack/react-form": "^1.28.5",
    "@tanstack/react-query": "^5.90.21",
    "better-auth": "^1.2.8",
    "next": "16.1.5",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@<%= projectName %>/eslint-config": "workspace:*",
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.2",
    "@types/react-dom": "19.2.2",
    "eslint": "^9.39.1",
    "typescript": "5.9.2"
  }
}`,
};
