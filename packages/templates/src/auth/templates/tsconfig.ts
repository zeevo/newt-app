export default {
  filename: "packages/auth/tsconfig.json",
  template: `{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "lib": ["es2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
};
