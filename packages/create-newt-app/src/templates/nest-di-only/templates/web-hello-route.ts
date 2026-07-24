export default {
  filename: "apps/web/app/api/hello/route.ts",
  template: `import { NextResponse } from 'next/server';
import { inject } from '@/lib/nest';
import { AppService } from '@<%= projectName %>/api';

export async function GET() {
  const appService = await inject(AppService);
  return NextResponse.json({ message: appService.getHello() });
}`,
};
