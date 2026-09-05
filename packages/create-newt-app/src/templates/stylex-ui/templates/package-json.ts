export default {
  filename: "packages/ui/package.json",
  template: `{
  "name": "@<%= projectName %>/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./globals.css": "./src/globals.css",
    "./tokens.stylex": "./src/tokens.stylex.ts",
    "./*": "./src/*.tsx"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
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
    "@stylexjs/stylex": "<%= versions["@stylexjs/stylex"] %>"
  }
}`,
};
