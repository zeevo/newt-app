export default {
  filename: "packages/ui/package.json",
  template: `{
  "name": "@<%= projectName %>/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./postcss.config": "./postcss.config.mjs",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./*": "./src/components/*.tsx"
  },
  "scripts": {},
  "dependencies": {
    "@base-ui/react": "<%= versions["@base-ui/react"] %>",
    "@shadcn/react": "<%= versions["@shadcn/react"] %>",
    "shadcn": "<%= versions.shadcn %>",
    "class-variance-authority": "<%= versions["class-variance-authority"] %>",
    "clsx": "<%= versions.clsx %>",
    "cmdk": "<%= versions.cmdk %>",
    "date-fns": "<%= versions["date-fns"] %>",
    "embla-carousel-react": "<%= versions["embla-carousel-react"] %>",
    "input-otp": "<%= versions["input-otp"] %>",
    "lucide-react": "<%= versions["lucide-react"] %>",
    "next-themes": "<%= versions["next-themes"] %>",
    "react-day-picker": "<%= versions["react-day-picker"] %>",
    "react-resizable-panels": "<%= versions["react-resizable-panels"] %>",
    "recharts": "<%= versions.recharts %>",
    "sonner": "<%= versions.sonner %>",
    "tailwind-merge": "<%= versions["tailwind-merge"] %>",
    "tw-animate-css": "<%= versions["tw-animate-css"] %>"
  },
  "peerDependencies": {
    "next": ">=15.0.0",
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0"
  },
  "devDependencies": {
    "@<%= projectName %>/typescript-config": "workspace:*",
    "@tailwindcss/postcss": "<%= versions["@tailwindcss/postcss"] %>",
    "@types/node": "<%= versions["@types/node"] %>",
    "@types/react": "<%= versions["@types/react"] %>",
    "@types/react-dom": "<%= versions["@types/react-dom"] %>",
    "tailwindcss": "<%= versions.tailwindcss %>",
    "typescript": "<%= versions.typescript %>"
  }
}`,
};
