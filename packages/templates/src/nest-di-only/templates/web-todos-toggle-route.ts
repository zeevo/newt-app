export default {
  filename: "apps/web/app/api/todos/[id]/toggle/route.ts",
  template: `import { NextResponse } from 'next/server';
import { getContext } from '@/lib/nest';
import { TodosService } from '@<%= projectName %>/api';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getContext();
  const todos = app.get(TodosService);
  return NextResponse.json(todos.toggle(Number(id)));
}`,
};
