export default {
  filename: "apps/web/app/api/todos/[id]/route.ts",
  template: `import { route } from '@/lib/nest';
import { TodosController } from '@<%= projectName %>/api';

export const { DELETE } = route(TodosController);`,
};
