export default {
  filename: "apps/web/app/todo-list.tsx",
  template: `'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { authClient } from '@/lib/auth-client';
import { Button } from '@<%= projectName %>/ui/button';
import type { Todo } from '@<%= projectName %>/db';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error('Request failed with status ' + res.status);
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

const api = {
  getTodos: () => request<Todo[]>('/api/todos'),
  createTodo: (title: string) =>
    request<Todo>('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }),
  toggleTodo: (id: string) =>
    request<Todo>(\`/api/todos/\${id}/toggle\`, { method: 'PATCH' }),
  deleteTodo: (id: string) => request<void>(\`/api/todos/\${id}\`, { method: 'DELETE' }),
};

export function TodoList({
  session,
}: {
  session: { user: { email: string } };
}) {
  const queryClient = useQueryClient();

  const { data: todos = [], isPending, isError } = useQuery({
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Todos</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{session.user.email}</span>
          <button
            className="hover:text-gray-100"
            onClick={() => authClient.signOut()}
          >
            Sign out
          </button>
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
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="New todo…"
              className="flex h-9 flex-1 rounded-md border border-neutral-700 bg-muted/50 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-neutral-500 focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500/20"
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

      {(createMutation.isError || toggleMutation.isError || deleteMutation.isError) && (
        <p className="text-sm text-red-400 mb-4">Something went wrong. Try again.</p>
      )}

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : isError ? (
        <p className="text-sm text-red-400">Couldn't load todos.</p>
      ) : (
        <ul className="divide-y divide-neutral-700">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleMutation.mutate(todo.id)}
              />
              <span
                className={\`flex-1 text-sm \${todo.done ? 'line-through text-muted-foreground' : ''}\`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteMutation.mutate(todo.id)}
                className="text-gray-600 hover:text-red-400 text-lg leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isPending && todos.length === 0 && (
        <p className="text-sm text-muted-foreground">No todos yet.</p>
      )}
    </>
  );
}`,
};
