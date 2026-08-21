import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.nestDiOnly && s.todoExample,
  filename: "apps/api/src/app.module.ts",
  template: `import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [TodosModule],
  providers: [AppService],
})
export class AppModule {}`,
};
