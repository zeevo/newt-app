export default {
  filename: "packages/db/src/schema.ts",
  template: `import type { Generated } from "kysely";

export interface TodoTable {
  id: string;
  userId: string;
  title: string;
  done: Generated<number>;
  createdAt: Generated<string>;
}

export interface DB {
  todo: TodoTable;
}`,
};
