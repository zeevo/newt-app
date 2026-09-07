export default {
  filename: "apps/web/app/api/hello/route.ts",
  template: `import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@<%= projectName %>/auth';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  return NextResponse.json({
    message: session?.user.name ? \`Hello \${session.user.name}\` : 'Hello from Next',
  });
}`,
};
