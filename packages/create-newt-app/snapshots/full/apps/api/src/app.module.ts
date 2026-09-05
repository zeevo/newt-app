import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@my-app/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [AuthModule.forRoot({ auth }), TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}