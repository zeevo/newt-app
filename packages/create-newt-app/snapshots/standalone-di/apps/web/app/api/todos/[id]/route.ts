import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { inject } from '@/lib/nest';
import { auth } from '@my-app/auth';
import { TodosService } from '@my-app/api';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const { id } = await params;
  const todos = await inject(TodosService);
  await todos.remove(session.user.id, id);
  return new NextResponse(null, { status: 204 });
}