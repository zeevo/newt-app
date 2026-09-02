export default {
  filename: "packages/auth/tsconfig.json",
  template: `{
  "compilerOptions": {
    "erasableSyntaxOnly": true,
    "esModuleInterop": true,
    "lib": ["es2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noEmit": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
};
