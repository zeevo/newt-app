export default {
  filename: "apps/web/app/api/todos/route.ts",
  template: `import { NextResponse } from 'next/server';
import { inject } from '@/lib/nest';
import { TodosService } from '@<%= projectName %>/api';

export async function GET() {
  const todos = await inject(TodosService);
  return NextResponse.json(todos.findAll());
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const todos = await inject(TodosService);
  return NextResponse.json(todos.create(title), { status: 201 });
}`,
};
