export default {
  filename: "packages/api/src/todos/todos.service.spec.ts",
  template: `import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    service = new TodosService();
  });

  it('starts with no todos', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('creates a todo', () => {
    const todo = service.create('Buy milk');
    expect(todo.title).toBe('Buy milk');
    expect(todo.done).toBe(false);
  });

  it('toggles a todo', () => {
    const todo = service.create('Buy milk');
    const toggled = service.toggle(todo.id);
    expect(toggled.done).toBe(true);
  });

  it('removes a todo', () => {
    const todo = service.create('Buy milk');
    service.remove(todo.id);
    expect(service.findAll()).toEqual([]);
  });
});`,
};
