export default {
  filename: "apps/api/src/todos/todos.controller.ts",
  template: `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Post()
  create(@Body('title') title: string) {
    return this.todosService.create(title);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.todosService.toggle(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}`,
};
