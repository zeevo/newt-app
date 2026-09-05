import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';

@Module({
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}