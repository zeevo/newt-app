export default {
  filename: "turbo.json",
  template: `{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"],
      "env": ["NODE_ENV"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "dependsOn": ["^migrate", "^build"],
      "cache": false,
      "persistent": true
    },
    "migrate": {
      "dependsOn": ["^migrate"],
      "cache": false
    },
    "generate": {
      "cache": false
    }
  }
}`,
};
