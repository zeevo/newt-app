import type { Selection } from "../../types";
export default {
  when: (s) => !s.todoExample,
  filename: "apps/api/src/index.ts",
  template: `export { AppModule } from './app.module';
export { AppService } from './app.service';`,
};
