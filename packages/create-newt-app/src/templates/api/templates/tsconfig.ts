import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.nest === "on",
  filename: "apps/api/tsconfig.json",
  template: `{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "resolvePackageJsonExports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": false,
    "types": [<% if (testing === 'jest') { %>"jest", <% } %><% if (testing === 'vitest') { %>"vitest/globals", <% } %>"node"]
  },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
};
