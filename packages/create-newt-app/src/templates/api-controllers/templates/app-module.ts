import type { Selection } from "../../types";
export default {
  when: (s) => !s.nestDiOnly && !s.todoExample,
  filename: "apps/api/src/app.module.ts",
  template: `<% if (deployment === 'spa') { %>import { join } from 'path';
<% } %>import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
<% if (deployment === 'spa') { %>import { ServeStaticModule } from '@nestjs/serve-static';
<% } %>import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@<%= projectName %>/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
<% if (deployment === 'spa') { %>  imports: [
    // serves apps/web's static export; the api runs from apps/api
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '../web/out'),
      exclude: ['/api/{*splat}'],
    }),
    AuthModule.forRoot({ auth }),
  ],
<% } else { %>  imports: [AuthModule.forRoot({ auth })],
<% } -%>
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}`,
};
