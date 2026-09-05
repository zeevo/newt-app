import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { inject } from '@/lib/nest';
import { auth } from '@my-app/auth';
import { TodosService } from '@my-app/api';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const todos = await inject(TodosService);
  return NextResponse.json(await todos.findAll(session.user.id));
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const { title } = await req.json();
  const todos = await inject(TodosService);
  return NextResponse.json(await todos.create(session.user.id, title), {
    status: 201,
  });
}