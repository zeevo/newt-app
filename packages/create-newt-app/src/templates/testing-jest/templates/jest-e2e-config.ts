import type { Selection } from "../../types";
export default {
  when: (s) => s.mode !== "bare",
  filename: "apps/api/test/jest-e2e.json",
  template: `{
  "moduleFileExtensions": ["js", "mjs", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "extensionsToTreatAsEsm": [".ts"],
  "transform": {
    "^.+\\\\.ts$": ["ts-jest", { "useESM": true, "tsconfig": { "module": "esnext" } }]
  },
  "transformIgnorePatterns": ["node_modules/(?!.*\\\\.mjs$)"]
}`,
};
