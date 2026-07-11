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
  async findAll(): Promise<Todo[]> {
    const rows = await db
      .selectFrom('todo')
      .select(columns)
      .orderBy('createdAt desc')
      .execute();
    return rows.map((row) => ({ ...row, done: Boolean(row.done) }));
  }

  async create(title: string): Promise<Todo> {
    const id = randomUUID();
    await db.insertInto('todo').values({ id, title }).execute();
    const row = await db
      .selectFrom('todo')
      .select(columns)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return { ...row, done: Boolean(row.done) };
  }

  async toggle(id: string): Promise<Todo> {
    const current = await db
      .selectFrom('todo')
      .select('done')
      .where('id', '=', id)
      .executeTakeFirst();
    if (!current) throw new NotFoundException('Todo ' + id + ' not found');
    await db
      .updateTable('todo')
      .set({ done: current.done ? 0 : 1 })
      .where('id', '=', id)
      .execute();
    const row = await db
      .selectFrom('todo')
      .select(columns)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return { ...row, done: Boolean(row.done) };
  }

  async remove(id: string): Promise<void> {
    const result = await db
      .deleteFrom('todo')
      .where('id', '=', id)
      .executeTakeFirst();
    if (!result.numDeletedRows) {
      throw new NotFoundException('Todo ' + id + ' not found');
    }
  }
}`,
};
