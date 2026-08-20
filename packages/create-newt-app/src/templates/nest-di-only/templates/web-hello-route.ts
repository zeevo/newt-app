export default {
  filename: "apps/web/app/api/hello/route.ts",
  template: `import { route } from '@/lib/nest';
import { AppController } from '@<%= projectName %>/api';

export const { GET } = route(AppController);`,
};
