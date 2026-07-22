import type { Module } from '../types';
import appController from './templates/app-controller';
import appControllerSpec from './templates/app-controller-spec';
import appModule from './templates/app-module';
import main from '../api/templates/main';

const apiControllers: Module = {
  templates: [
    appController,
    appControllerSpec,
    appModule,
    main,
  ],
};

export default apiControllers;
