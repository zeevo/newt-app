'use client';

import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { AuthForm } from '@/app/auth-form';
import { Button } from '@my-app/ui/button';
import { Link } from '@my-app/ui/link';
import { Logo } from '@my-app/ui/logo';
import { ModeToggle } from '@my-app/ui/mode-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@my-app/ui/card';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const { data: hello } = useQuery({
    queryKey: ['hello'],
    queryFn: () => fetch('/api/hello').then((r) => r.json()),
  });

  return (
    <main className="max-w-lg mx-auto min-h-full px-4 py-8 space-y-4">
      <div className="pb-4 border-b flex items-start justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">apps/web/app/page.tsx</p>
          <p className="text-sm text-muted-foreground">Delete me to get started!</p>
        </div>
        <ModeToggle />
      </div>

      <div className="flex items-center gap-3 py-2">
        <Logo className="w-10 h-auto text-foreground" />
        <div>
          <h1 className="text-4xl font-black tracking-tight">my-app</h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">
            Next + Nest = Newt 💜
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            next.js
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm text-muted-foreground">apps/web/app/layout.tsx</p>
          <p className="text-sm text-muted-foreground">Next.js rendering</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            nest.js
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm text-muted-foreground">GET /api/hello</p>
          <pre className="mt-2 rounded-md border p-3 text-sm bg-muted/50">
            <code>{JSON.stringify(hello, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            better-auth
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : session ? (
            <div className="space-y-3">
              <p className="text-sm">Signed in as {session.user.name}</p>
              <Button variant="outline" onClick={() => authClient.signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <AuthForm />
          )}
        </CardContent>
      </Card>

      <div className="px-2 py-4 text-sm">
        <p className="mb-2 text-muted-foreground">Learn more</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>
            <Link href="https://newt-app.com">Documentation</Link>
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
}