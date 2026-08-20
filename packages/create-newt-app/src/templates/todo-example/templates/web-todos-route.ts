export default {
  filename: "apps/web/app/api/todos/route.ts",
  template: `import { route } from '@/lib/nest';
import { TodosController } from '@<%= projectName %>/api';

export const { GET, POST } = route(TodosController);`,
};
