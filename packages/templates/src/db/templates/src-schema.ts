export default {
  filename: "packages/db/src/schema.ts",
  template: `// The Kysely database schema for your application tables.
//
// Add an interface per table, then reference it from a migration in
// ./migrations (run \`pnpm db:make <name>\` to scaffold one). Auth tables are
// owned by Better Auth and managed with \`pnpm db:generate\` / \`auth migrate\`,
// so they don't need to be declared here.
//
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DB {}`,
};
