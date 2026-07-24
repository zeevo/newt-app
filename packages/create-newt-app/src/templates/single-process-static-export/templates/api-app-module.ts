export default {
  filename: "apps/api/src/app.module.ts",
  template: `import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@<%= projectName %>/auth';
import { AppController } from './app.controller';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '../web/out'),
      exclude: ['/api/(.*)'],
    }),
    AuthModule.forRoot({ auth }),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}`,
};
