export default {
  filename: "apps/web/tsconfig.server.json",
  template: `{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "target": "ES2023",
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": false
  },
  "include": ["server.ts"],
  "exclude": ["node_modules"]
}`,
};
