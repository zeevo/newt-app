export default {
  filename: "apps/web/app/api/todos/route.ts",
  template: `import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@<%= projectName %>/auth';
import { create, findAll } from '@/lib/todos';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  return NextResponse.json(await findAll(session.user.id));
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const { title } = await req.json();
  return NextResponse.json(await create(session.user.id, title), {
    status: 201,
  });
}`,
};
