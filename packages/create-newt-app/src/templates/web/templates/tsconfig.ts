import type { Selection } from "../../types";
export default {
  when: (s: Selection) => !s.nestDiOnly,
  filename: "apps/web/tsconfig.json",
  template: `{
  "extends": "@<%= projectName %>/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "strictNullChecks": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "next-env.d.ts",
    "next.config.js",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}`,
};
