export default {
  filename: "apps/api/src/todos/todos.service.ts",
  template: `import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { db } from '@<%= projectName %>/db';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

const columns = ['id', 'title', 'done', 'createdAt'] as const;

@Injectable()
export class TodosService {
  async findAll(userId: string): Promise<Todo[]> {
    const rows = await db
      .selectFrom('todo')
      .select(columns)
      .where('userId', '=', userId)
      .orderBy('createdAt desc')
      .execute();
    return rows.map((row) => ({ ...row, done: Boolean(row.done) }));
  }

  async create(userId: string, title: string): Promise<Todo> {
    const id = randomUUID();
    await db.insertInto('todo').values({ id, userId, title }).execute();
    const row = await db
      .selectFrom('todo')
      .select(columns)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return { ...row, done: Boolean(row.done) };
  }

  async toggle(userId: string, id: string): Promise<Todo> {
    const current = await db
      .selectFrom('todo')
      .select('done')
      .where('id', '=', id)
      .where('userId', '=', userId)
      .executeTakeFirst();
    if (!current) throw new NotFoundException('Todo ' + id + ' not found');
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

  async remove(userId: string, id: string): Promise<void> {
    const result = await db
      .deleteFrom('todo')
      .where('id', '=', id)
      .where('userId', '=', userId)
      .executeTakeFirst();
    if (!result.numDeletedRows) {
      throw new NotFoundException('Todo ' + id + ' not found');
    }
  }
}`,
};
