export default {
  filename: "apps/api/src/index.ts",
  template: `export { AppModule } from './app.module';
export { AppService } from './app.service';
export { TodosService } from './todos/todos.service';
export type { Todo } from './todos/todos.service';`,
};
