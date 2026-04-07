export default {
  filename: "packages/api/src/todos/todos.service.ts",
  template: `import { Injectable, NotFoundException } from '@nestjs/common';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private nextId = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  create(title: string): Todo {
    const todo: Todo = { id: this.nextId++, title, done: false };
    this.todos.push(todo);
    return todo;
  }

  toggle(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) throw new NotFoundException(\`Todo \${id} not found\`);
    todo.done = !todo.done;
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(\`Todo \${id} not found\`);
    this.todos.splice(index, 1);
  }
}`,
};
