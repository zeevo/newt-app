import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [TodosModule],
  providers: [AppService],
})
export class AppModule {}