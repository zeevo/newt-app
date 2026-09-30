export default {
  filename: "apps/web/app/todo-list.tsx",
  template: `'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import * as stylex from '@stylexjs/stylex';
import { authClient } from '@/lib/auth-client';
import { Button } from '@<%= projectName %>/ui/button';
import { colors, radii } from '@<%= projectName %>/ui/tokens.stylex';
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
      <div {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.h1)}>Todos</h1>
        <div {...stylex.props(styles.session)}>
          <span>{session.user.email}</span>
          <button
            {...stylex.props(styles.signOut)}
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
        {...stylex.props(styles.form)}
      >
        <form.Field name="title">
          {(field) => (
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="New todo…"
              {...stylex.props(styles.input)}
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
        <p {...stylex.props(styles.error)}>Something went wrong. Try again.</p>
      )}

      {isPending ? (
        <p {...stylex.props(styles.muted)}>Loading…</p>
      ) : isError ? (
        <p {...stylex.props(styles.error)}>Couldn&apos;t load todos.</p>
      ) : (
        <ul {...stylex.props(styles.list)}>
          {todos.map((todo) => (
            <li key={todo.id} {...stylex.props(styles.item)}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleMutation.mutate(todo.id)}
              />
              <span {...stylex.props(styles.title, todo.done && styles.titleDone)}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteMutation.mutate(todo.id)}
                {...stylex.props(styles.remove)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isPending && todos.length === 0 && (
        <p {...stylex.props(styles.muted)}>No todos yet.</p>
      )}
    </>
  );
}

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  h1: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  session: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: colors.mutedForeground,
  },
  signOut: {
    color: {
      default: 'inherit',
      ':hover': colors.foreground,
    },
    backgroundColor: 'transparent',
    borderStyle: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    flexGrow: 1,
    height: 36,
    paddingBlock: '0.25rem',
    paddingInline: '0.75rem',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    color: colors.foreground,
    backgroundColor: 'oklch(0.269 0 0 / 0.5)',
    borderColor: {
      default: colors.border,
      ':focus-visible': colors.mutedForeground,
    },
    borderRadius: radii.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    outlineStyle: 'none',
    transitionProperty: 'border-color',
    transitionDuration: '150ms',
  },
  list: {
    listStyleType: 'none',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBlock: '0.75rem',
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: {
      default: 1,
      ':first-child': 0,
    },
  },
  title: {
    flexGrow: 1,
    fontSize: '0.875rem',
  },
  titleDone: {
    color: colors.mutedForeground,
    textDecorationLine: 'line-through',
  },
  remove: {
    color: {
      default: colors.mutedForeground,
      ':hover': colors.danger,
    },
    backgroundColor: 'transparent',
    borderStyle: 'none',
    cursor: 'pointer',
    padding: 0,
    fontSize: '1.125rem',
    lineHeight: 1,
  },
  muted: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
  },
  error: {
    fontSize: '0.875rem',
    color: colors.danger,
    marginBottom: '1rem',
  },
});
`,
};
