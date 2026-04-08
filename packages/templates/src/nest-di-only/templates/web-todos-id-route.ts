export default {
  filename: "apps/web/app/api/todos/[id]/route.ts",
  template: `import { NextResponse } from 'next/server';
import { getNestApp } from '@/lib/nest';
import { TodosService } from '@<%= projectName %>/api';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getNestApp();
  const todos = app.get(TodosService);
  todos.remove(Number(id));
  return new NextResponse(null, { status: 204 });
}`,
};
