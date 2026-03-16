export default {
  filename: "apps/web/app/todo-list.tsx",
  template: `'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { authClient } from '../lib/auth-client';

interface Todo {
  id: number;
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
  toggleTodo: (id: number): Promise<Todo> =>
    fetch(\`/api/todos/\${id}/toggle\`, { method: 'PATCH' }).then((r) => r.json()),
  deleteTodo: (id: number): Promise<void> =>
    fetch(\`/api/todos/\${id}\`, { method: 'DELETE' }).then(() => undefined),
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Todos</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{session.user.email}</span>
          <button
            className="hover:text-gray-900"
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
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
            />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="bg-gray-900 text-white rounded px-4 py-2 text-sm hover:bg-gray-700 disabled:opacity-40"
            >
              Add
            </button>
          )}
        </form.Subscribe>
      </form>

      {isPending ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleMutation.mutate(todo.id)}
              />
              <span
                className={\`flex-1 text-sm \${todo.done ? 'line-through text-gray-500' : ''}\`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteMutation.mutate(todo.id)}
                className="text-gray-300 hover:text-red-400 text-lg leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isPending && todos.length === 0 && (
        <p className="text-sm text-gray-500">No todos yet.</p>
      )}
    </>
  );
}`,
};
