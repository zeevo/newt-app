export default {
  filename: "apps/api/src/todos/todos.module.ts",
  template: `import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}`,
};
