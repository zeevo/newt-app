export default {
  filename: "packages/db/src/schema.ts",
  template: `import type { Generated } from "kysely";

// App tables for the todo example. \`done\` is stored as 0/1 and \`createdAt\`
// defaults in the database, so both are Generated (omittable on insert).
export interface TodoTable {
  id: string;
  title: string;
  done: Generated<number>;
  createdAt: Generated<string>;
}

export interface DB {
  todo: TodoTable;
}`,
};
