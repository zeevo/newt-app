import type { Selection } from "../../types";
export default {
  when: (s) => s.mode === "nest-di-only" && !s.includeExample,
  filename: "apps/api/src/app.module.ts",
  template: `import { Module } from '@nestjs/common';
import { AppService } from './app.service';

@Module({
  providers: [AppService],
})
export class AppModule {}`,
};
