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
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@tailwindcss/postcss": "<%= versions["@tailwindcss/postcss"] %>",
    "tailwindcss": "<%= versions.tailwindcss %>",
    "@types/node": "<%= versions["@types/node"] %>",
    "@types/react": "<%= versions["@types/react"] %>",
    "@types/react-dom": "<%= versions["@types/react-dom"] %>",
    "typescript": "<%= versions.typescript %>"
  },
  "peerDependencies": {
    "next": ">=15.0.0",
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0"
  },
  "dependencies": {
    "clsx": "<%= versions.clsx %>",
    "tailwind-merge": "<%= versions["tailwind-merge"] %>"
  }
}`,
};
