export default {
  filename: "apps/web/app/api/todos/[id]/toggle/route.ts",
  template: `import { route } from '@/lib/nest';
import { TodosController } from '@<%= projectName %>/api';

export const { PATCH } = route(TodosController);`,
};
