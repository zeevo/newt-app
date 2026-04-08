export default {
  filename: "packages/api/src/todos/todos.module.ts",
  template: `import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';

@Module({
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}`,
};
