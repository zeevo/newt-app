export default {
  filename: "apps/web/lib/nest.ts",
  template: `import { createNestAdapter } from '@newt-app/nest-next-adapter';
import { AppModule } from '@<%= projectName %>/api';

export const { route, inject, getContext } = createNestAdapter(AppModule);`,
};
