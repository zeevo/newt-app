import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.nest === "di-only" && !s.todoExample,
  filename: "apps/api/src/app.module.ts",
  template: `import { Module } from '@nestjs/common';
import { AppService } from './app.service';

@Module({
  providers: [AppService],
})
export class AppModule {}`,
};
