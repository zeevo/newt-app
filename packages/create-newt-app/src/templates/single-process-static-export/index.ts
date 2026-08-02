import type { Module } from "../types";
import apiPackageJson from "./templates/api-package-json";
import webNextConfig from "./templates/web-next-config";

// app.module.ts is not templated here: api-controllers and todo-example both
// write that file and land after this module, so anything emitted here is
// overwritten. Those templates add ServeStaticModule when deployment is 'spa'.
const singleProcessStaticExport: Module = {
  appModule: {
    importStatements: [
      "import { join } from 'path';",
      "import { ServeStaticModule } from '@nestjs/serve-static';",
    ],
    imports: [
      `// serves apps/web's static export; the api runs from apps/api
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '../web/out'),
      exclude: ['/api/{*splat}'],
    })`,
    ],
  },
  templates: [apiPackageJson, webNextConfig],
};

export default singleProcessStaticExport;
