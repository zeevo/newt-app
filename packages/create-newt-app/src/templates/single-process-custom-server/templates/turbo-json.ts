export default {
  filename: "turbo.json",
  template: `{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "env": ["DATABASE_URL", "PORT"],
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
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
      "env": ["DATABASE_URL", "PORT"],
      "dependsOn": ["^migrate", "^build"],
      "cache": false,
      "persistent": true
    },
    "migrate": {
      "env": ["DATABASE_URL"],
      "dependsOn": ["^migrate"],
      "cache": false
    },
    "generate": {
      "env": ["DATABASE_URL"],
      "cache": false
    }
  }
}`,
};
