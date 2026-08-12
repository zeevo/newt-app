export default {
  filename: "apps/api/src/index.ts",
  template: `export { AppModule } from './app.module';
export { AppController } from './app.controller';
export { AppService } from './app.service';
export { TodosController } from './todos/todos.controller';
export { TodosService } from './todos/todos.service';
export type { Todo } from './todos/todos.service';`,
};
