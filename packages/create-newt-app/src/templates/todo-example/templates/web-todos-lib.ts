export default {
  filename: "apps/web/lib/todos.ts",
  template: `import { randomUUID } from 'node:crypto';
import { db } from '@<%= projectName %>/db';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super('Todo ' + id + ' not found');
    this.name = 'TodoNotFoundError';
  }
}

const columns = ['id', 'title', 'done', 'createdAt'] as const;

export async function findAll(userId: string): Promise<Todo[]> {
  const rows = await db
    .selectFrom('todo')
    .select(columns)
    .where('userId', '=', userId)
    .orderBy('createdAt desc')
    .execute();
  return rows.map((row) => ({ ...row, done: Boolean(row.done) }));
}

export async function create(userId: string, title: string): Promise<Todo> {
  const id = randomUUID();
  await db.insertInto('todo').values({ id, userId, title }).execute();
  const row = await db
    .selectFrom('todo')
    .select(columns)
    .where('id', '=', id)
    .executeTakeFirstOrThrow();
  return { ...row, done: Boolean(row.done) };
}

export async function toggle(userId: string, id: string): Promise<Todo> {
  const current = await db
    .selectFrom('todo')
    .select('done')
    .where('id', '=', id)
    .where('userId', '=', userId)
    .executeTakeFirst();
  if (!current) throw new TodoNotFoundError(id);
  await db
    .updateTable('todo')
    .set({ done: current.done ? 0 : 1 })
    .where('id', '=', id)
    .where('userId', '=', userId)
    .execute();
  const row = await db
    .selectFrom('todo')
    .select(columns)
    .where('id', '=', id)
    .executeTakeFirstOrThrow();
  return { ...row, done: Boolean(row.done) };
}

export async function remove(userId: string, id: string): Promise<void> {
  const result = await db
    .deleteFrom('todo')
    .where('id', '=', id)
    .where('userId', '=', userId)
    .executeTakeFirst();
  if (!result.numDeletedRows) {
    throw new TodoNotFoundError(id);
  }
}`,
};
