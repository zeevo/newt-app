import type { Selection } from "../../types";
export default {
  when: (s) => s.mode === "nest-di-only",
  filename: "apps/api/src/todos/todos.module.ts",
  template: `import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';

@Module({
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}`,
};
