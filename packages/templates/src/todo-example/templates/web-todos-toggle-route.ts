export default {
  filename: "apps/web/app/api/todos/[id]/toggle/route.ts",
  template: `import { NextResponse } from 'next/server';
import { inject } from '@/lib/nest';
import { TodosService } from '@<%= projectName %>/api';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const todos = await inject(TodosService);
  return NextResponse.json(await todos.toggle(id));
}`,
};
