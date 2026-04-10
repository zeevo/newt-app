export default {
  filename: "apps/api/tsconfig.json",
  template: `{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2021",
    "types": ["jest", "node"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
};
