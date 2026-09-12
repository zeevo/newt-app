export default {
  filename: "turbo.json",
  template: `{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "env": ["API_HOST", "DATABASE_URL"],
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
      "dependsOn": ["^build"]
    },
    "dev": {
      "dependsOn": ["^migrate"],
      "env": ["DATABASE_URL"],
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
