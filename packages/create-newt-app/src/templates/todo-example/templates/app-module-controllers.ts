import type { Selection } from "../../types";
export default {
  when: (s: Selection) => !s.nestDiOnly && s.todoExample,
  filename: "apps/api/src/app.module.ts",
  template: `<% if (deployment === 'spa') { %>import { join } from 'path';
<% } %>import { Module } from '@nestjs/common';
<% if (deployment === 'spa') { %>import { ServeStaticModule } from '@nestjs/serve-static';
<% } %>import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@<%= projectName %>/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';

@Module({
<% if (deployment === 'spa') { %>  imports: [
    // serves apps/web's static export; the api runs from apps/api
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '../web/out'),
      exclude: ['/api/{*splat}'],
    }),
    AuthModule.forRoot({ auth }),
    TodosModule,
  ],
<% } else { %>  imports: [AuthModule.forRoot({ auth }), TodosModule],
<% } -%>
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`,
};
