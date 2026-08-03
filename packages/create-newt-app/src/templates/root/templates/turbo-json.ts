import type { Selection } from "../../types";
export default {
  when: (s) => s.deployment !== 'standalone' && s.deployment !== 'custom-server',
  filename: "turbo.json",
  template: `{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
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
      "dependsOn": ["^migrate"],
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
