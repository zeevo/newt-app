export default {
  filename: "apps/web/app/api/hello/route.ts",
  template: `import { NextResponse } from 'next/server';
import { getContext } from '@/lib/nest';
import { AppService } from '@<%= projectName %>/api';

export async function GET() {
  const ctx = await getContext();
  const appService = ctx.get(AppService);
  return NextResponse.json({ message: appService.getHello() });
}`,
};
