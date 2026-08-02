import type { Module } from '../types';
import appController from './templates/app-controller';
import appControllerSpec from './templates/app-controller-spec';
import main from '../api/templates/main';

const apiControllers: Module = {
  appModule: {
    importStatements: [
      "import { APP_GUARD } from '@nestjs/core';",
      "import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';",
      "import { auth } from '@<%= projectName %>/auth';",
      "import { AppController } from './app.controller';",
    ],
    imports: ["AuthModule.forRoot({ auth })"],
    controllers: ["AppController"],
    providers: ["{ provide: APP_GUARD, useClass: AuthGuard }"],
  },
  templates: [
    appController,
    appControllerSpec,
    main,
  ],
};

export default apiControllers;
