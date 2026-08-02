import type { Selection } from "../../types";
export default {
  when: (s) => !s.nestDiOnly && s.deployment !== 'custom-server',
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
