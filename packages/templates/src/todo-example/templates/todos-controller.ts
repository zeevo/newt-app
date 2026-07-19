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
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Session() session: UserSession) {
    return this.todosService.findAll(session.user.id);
  }

  @Post()
  create(@Session() session: UserSession, @Body('title') title: string) {
    return this.todosService.create(session.user.id, title);
  }

  @Patch(':id/toggle')
  toggle(@Session() session: UserSession, @Param('id') id: string) {
    return this.todosService.toggle(session.user.id, id);
  }

  @Delete(':id')
  remove(@Session() session: UserSession, @Param('id') id: string) {
    return this.todosService.remove(session.user.id, id);
  }
}`,
};
