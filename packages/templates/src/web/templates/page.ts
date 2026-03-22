export default {
  filename: 'apps/web/app/page.tsx',
  template: `'use client';

import { useQuery } from '@tanstack/react-query';
import { authClient } from '../lib/auth-client';
import { AuthForm } from './auth-form';
import { Link } from '@<%= projectName %>/ui/link';
import { Logo } from '@<%= projectName %>/ui/logo';
import { TodoList } from './todo-list';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const { data: hello } = useQuery({
    queryKey: ['hello'],
    queryFn: () => fetch('/api/hello').then((r) => r.json()),
  });

  return (
    <main className="max-w-lg mx-auto border-r border-l min-h-full">
      <div className="border-b p-4">
        <p className="font-mono">apps/web/page.tsx</p>
        <p className="text-gray-400">Delete me to get started!</p>
      </div>
      <div className="border-b p-4">
        <div className="flex items-center gap-3 pb-2">
          <Logo className="w-10 h-auto text-foreground" />
          <h1 className="text-5xl font-black tracking-tight">
            <%= projectName %>
          </h1>
        </div>
        <p className="mt-2 text-sm text-gray-400 tracking-widest uppercase">
          Next + Nest = Newt 💜
        </p>
        <p className="text-gray-400">The perfect TypeScript monorepo setup</p>
      </div>
      <div className="border-b p-4">
        <div className="flex justify-end text-gray-400 uppercase">
          <h2>next.js</h2>
        </div>
        <p className="font-mono">apps/web/layout.tsx</p>
        <p className="text-gray-400">Next.js rendering</p>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-end text-gray-400 uppercase">
          <h2>nest.js</h2>
        </div>
        <p className="font-mono">GET /api/hello</p>
        <pre className="mt-2 border rounded-md p-3 text-sm bg-neutral-800">
          <code>{JSON.stringify(hello, null, 2)}</code>
        </pre>
      </div>
      <div className="p-4 border-b">
        <div className="flex justify-end text-gray-400 uppercase">
          <h2>better-auth</h2>
        </div>
        {isPending ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : session ? (
          <TodoList session={session} />
        ) : (
          <AuthForm />
        )}
      </div>
      <div className="p-4 text-sm">
        <p className="mb-2">Learn more</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>
            <Link href="https://github.com">GitHub</Link>
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
