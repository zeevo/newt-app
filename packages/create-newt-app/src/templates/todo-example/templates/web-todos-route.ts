export default {
  filename: "apps/web/app/api/todos/route.ts",
  template: `import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { inject } from '@/lib/nest';
import { auth } from '@<%= projectName %>/auth';
import { TodosService } from '@<%= projectName %>/api';
import { z } from 'zod';

// The same title check the controller applies in --nest on mode.
const createTodoSchema = z.object({ title: z.string().trim().min(1) });

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const todos = await inject(TodosService);
  return NextResponse.json(await todos.findAll(session.user.id));
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const parsed = createTodoSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: parsed.error.issues.map((issue) => issue.message),
        error: 'Bad Request',
        statusCode: 400,
      },
      { status: 400 },
    );
  }
  const todos = await inject(TodosService);
  return NextResponse.json(await todos.create(session.user.id, parsed.data.title), {
    status: 201,
  });
}`,
};
