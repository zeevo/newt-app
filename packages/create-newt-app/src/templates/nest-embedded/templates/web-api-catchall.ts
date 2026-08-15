export default {
  filename: "apps/web/pages/api/[[...path]].ts",
  template: `import { nest } from '@/lib/nest';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default nest.handler;`,
};
