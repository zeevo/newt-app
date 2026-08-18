export default {
  filename: "apps/web/app/api/todos/[id]/toggle/route.ts",
  template: `import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@<%= projectName %>/auth';
import { toggle } from '@/lib/todos';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const { id } = await params;
  return NextResponse.json(await toggle(session.user.id, id));
}`,
};
