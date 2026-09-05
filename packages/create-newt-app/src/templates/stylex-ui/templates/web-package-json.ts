import type { Selection } from "../../types";
export default {
  when: (s: Selection) => !s.nestDiOnly,
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
    "typecheck": "next typegen && tsc --noEmit",
    "db:migrate": "better-auth migrate"
  },
  "dependencies": {
    "@<%= projectName %>/auth": "workspace:*",
    "@<%= projectName %>/ui": "workspace:*",
    "@stylexjs/stylex": "<%= versions["@stylexjs/stylex"] %>",
    "dotenv": "<%= versions.dotenv %>",
    "@tanstack/react-form": "<%= versions["@tanstack/react-form"] %>",
    "@tanstack/react-query": "<%= versions["@tanstack/react-query"] %>",
    "better-auth": "<%= versions["better-auth"] %>",
    "next": "<%= versions.next %>",
    "react": "<%= versions.react %>",
    "react-dom": "<%= versions["react-dom"] %>"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@stylexjs/babel-plugin": "<%= versions["@stylexjs/babel-plugin"] %>",
    "@stylexjs/postcss-plugin": "<%= versions["@stylexjs/postcss-plugin"] %>",
    "@types/node": "<%= versions["@types/node"] %>",
    "@types/react": "<%= versions["@types/react"] %>",
    "@types/react-dom": "<%= versions["@types/react-dom"] %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
