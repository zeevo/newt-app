'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { authClient } from '@/lib/auth-client';
import { Button } from '@my-app/ui/button';
import { Input } from '@my-app/ui/input';
import { Checkbox } from '@my-app/ui/checkbox';

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

const api = {
  getTodos: (): Promise<Todo[]> => fetch('/api/todos').then((r) => r.json()),
  createTodo: (title: string): Promise<Todo> =>
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then((r) => r.json()),
  toggleTodo: (id: string): Promise<Todo> =>
    fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' }).then((r) => r.json()),
  deleteTodo: (id: string): Promise<void> =>
    fetch(`/api/todos/${id}`, { method: 'DELETE' }).then(() => undefined),
};

export function TodoList({
  session,
}: {
  session: { user: { email: string } };
}) {
  const queryClient = useQueryClient();

  const { data: todos = [], isPending } = useQuery({
    queryKey: ['todos'],
    queryFn: api.getTodos,
  });

  const createMutation = useMutation({
    mutationFn: api.createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: api.toggleTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const form = useForm({
    defaultValues: { title: '' },
    onSubmit: async ({ value }) => {
      if (!value.title.trim()) return;
      createMutation.mutate(value.title.trim());
      form.reset();
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Todos</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{session.user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => authClient.signOut()}
          >
            Sign out
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex gap-2 mb-6"
      >
        <form.Field name="title">
          {(field) => (
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="New todo…"
              className="flex-1"
            />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              Add
            </Button>
          )}
        </form.Subscribe>
      </form>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <ul className="divide-y divide-border">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 py-3">
              <Checkbox
                checked={todo.done}
                onCheckedChange={() => toggleMutation.mutate(todo.id)}
              />
              <span
                className={`flex-1 text-sm ${todo.done ? 'line-through text-muted-foreground' : ''}`}
              >
                {todo.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(todo.id)}
                className="text-muted-foreground hover:text-destructive h-7 w-7 p-0"
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!isPending && todos.length === 0 && (
        <p className="text-sm text-muted-foreground">No todos yet.</p>
      )}
    </>
  );
}