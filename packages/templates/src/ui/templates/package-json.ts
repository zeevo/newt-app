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
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "typescript": "6.0.2"
  },
  "peerDependencies": {
    "next": ">=15.0.0",
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.0"
  }
}`,
};
