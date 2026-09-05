import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@my-app/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    // serves apps/web's static export; the api runs from apps/api
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '../web/out'),
      exclude: ['/api/{*splat}'],
    }),
    AuthModule.forRoot({ auth }),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}