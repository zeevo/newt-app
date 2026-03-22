export default {
  filename: "packages/ui/package.json",
  template: `{
  "name": "@<%= projectName %>/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./globals.css": "./src/globals.css",
    "./postcss.config": "./postcss.config.mjs",
    "./utils": "./src/utils.ts",
    "./*": "./src/*.tsx"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@<%= projectName %>/eslint-config": "workspace:*",
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.2",
    "@types/react-dom": "19.2.2",
    "eslint": "^9.39.1",
    "typescript": "5.9.2"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwind-merge": "^3.3.0"
  }
}`,
};
