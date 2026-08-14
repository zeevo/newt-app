import type { Selection } from "../../types";
export default {
  when: (s) => !s.nestDiOnly,
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
    "rootDir": "./src",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false,
    "types": [<% if (testing === 'jest') { %>"jest", <% } %><% if (testing === 'vitest') { %>"vitest/globals", <% } %>"node"]
  },
  "exclude": ["vitest.config.mts", "vitest.config.e2e.mts", "node_modules", "dist"]
}`,
};
