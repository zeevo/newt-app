import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.deployment !== "standalone",
  filename: "turbo.json",
  template: `{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "env": ["DATABASE_URL"],
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },<% if (linter !== "oxc") { %>
    "lint": {
      "dependsOn": ["^lint"],
      "env": ["NODE_ENV"]
    },
    "lint:check": {
      "dependsOn": ["^lint:check"],
      "env": ["NODE_ENV"]
    },<% } %>
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "dependsOn": ["^migrate"],
      "env": ["DATABASE_URL"],
      "cache": false,
      "persistent": true
    },
    "migrate": {
      "dependsOn": ["^migrate"],
      "env": ["DATABASE_URL"],
      "cache": false
    },
    "generate": {
      "env": ["DATABASE_URL"],
      "cache": false
    }
  }
}`,
};
