export default {
  filename: "apps/web/app/api/todos/route.ts",
  template: `import { NextResponse } from 'next/server';
import { getNestApp } from '@/lib/nest';
import { TodosService } from '@<%= projectName %>/api';

export async function GET() {
  const app = await getNestApp();
  const todos = app.get(TodosService);
  return NextResponse.json(todos.findAll());
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const app = await getNestApp();
  const todos = app.get(TodosService);
  return NextResponse.json(todos.create(title), { status: 201 });
}`,
};
