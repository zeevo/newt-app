export default {
  filename: "apps/web/tsconfig.server.json",
  template: `{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
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
