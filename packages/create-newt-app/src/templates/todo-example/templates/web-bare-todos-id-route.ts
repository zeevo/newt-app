export default {
  filename: "apps/web/app/api/todos/[id]/route.ts",
  template: `import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@<%= projectName %>/auth';
import { remove } from '@/lib/todos';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const { id } = await params;
  await remove(session.user.id, id);
  return new NextResponse(null, { status: 204 });
}`,
};
