export default {
  filename: 'apps/web/app/page.tsx',
  template: `'use client';

import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { AuthForm } from '@/app/auth-form';
import { Button } from '@<%= projectName %>/ui/button';
import { Link } from '@<%= projectName %>/ui/link';
import { Logo } from '@<%= projectName %>/ui/logo';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const { data: hello } = useQuery({
    queryKey: ['hello'],
    queryFn: () => fetch('/api/hello').then((r) => r.json()),
  });

  return (
    <main className="max-w-lg mx-auto min-h-full px-4 py-8 space-y-4">
      <div className="pb-4 border-b">
        <p className="font-mono text-sm text-muted-foreground">apps/web/page.tsx</p>
        <p className="text-sm text-muted-foreground">Delete me to get started!</p>
      </div>

      <div className="flex items-center gap-3 py-2">
        <Logo className="w-10 h-auto text-foreground" />
        <div>
          <h1 className="text-4xl font-black tracking-tight"><%= projectName %></h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">
            Next + Nest = Newt 💜
          </p>
        </div>
      </div>

      <div className="rounded-xl border p-6 space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">next.js</p>
        <p className="font-mono text-sm text-muted-foreground">apps/web/layout.tsx</p>
        <p className="text-sm text-muted-foreground">Next.js rendering</p>
      </div>

      <div className="rounded-xl border p-6 space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">nest.js</p>
        <p className="font-mono text-sm text-muted-foreground">GET /api/hello</p>
        <pre className="mt-2 border rounded-md p-3 text-sm bg-muted/50">
          <code>{JSON.stringify(hello, null, 2)}</code>
        </pre>
      </div>

      <div className="rounded-xl border p-6">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">better-auth</p>
        {isPending ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : session ? (
          <div className="space-y-3">
            <p className="text-sm">Signed in as {session.user.name}</p>
            <Button onClick={() => void authClient.signOut()}>
              Sign out
            </Button>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>

      <div className="px-2 py-4 text-sm">
        <p className="mb-2 text-muted-foreground">Learn more</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>
            <Link href="https://newt-app.vercel.app">Documentation</Link>
          </li>
          <li>
            <Link href="https://github.com/zeevo/newt-app">GitHub</Link>
          </li>
          <li>
            <Link href="https://nextjs.org">Next.js</Link>
          </li>
          <li>
            <Link href="https://nestjs.com">NestJS</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}`,
};
