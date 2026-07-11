export default {
  filename: "packages/db/src/schema.ts",
  template: `import type { Generated } from "kysely";

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
