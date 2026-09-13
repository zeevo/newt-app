export default {
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
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": false,
    "types": [<% if (testing === 'jest') { %>"jest", <% } %><% if (testing === 'vitest') { %>"vitest/globals", <% } %>"node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
};
