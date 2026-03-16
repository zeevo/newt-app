export default {
  filename: "apps/web/app/page.tsx",
  template: `'use client';

import { useQuery } from '@tanstack/react-query';
import { authClient } from '../lib/auth-client';
import { AuthForm } from './auth-form';
import { Link } from '@repo/ui/link';
import { TodoList } from './todo-list';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const { data: hello } = useQuery({
    queryKey: ['hello'],
    queryFn: () => fetch('/api/hello').then((r) => r.json()),
  });

  return (
    <main className="max-w-lg mx-auto border-r border-l h-full">
      <div className="border-b p-4">
        <p className="font-mono">apps/web/page.tsx</p>
        <p className="text-gray-500">Delete me to get started!</p>
      </div>
      <div className="border-b p-4">
        <h1 className="text-5xl font-black tracking-tight bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          <%= projectName %>
        </h1>
        <p className="mt-2 text-sm text-gray-500 tracking-widest uppercase">
          Next + Nest = Newt 💜
        </p>
        <p className="text-gray-500">The perfect TypeScript monorepo setup</p>
      </div>
      <div className="border-b p-4 text-gray-500">
        <div className="flex justify-end text-gray-500">
          <h2 className="uppercase">Next.js</h2>
        </div>
        <p className="font-mono">apps/web/layout.tsx</p>
        <p>Next.js rendering</p>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-end text-gray-500">
          <h2 className="uppercase">Nest</h2>
        </div>
        <span className="font-mono text-gray-500 text-xs">
          HTTP GET /api/hello
        </span>
        <pre className="border p-2 rounded bg-gray-50">
          <code>{JSON.stringify(hello, null, 2)}</code>
        </pre>
      </div>
      <div className="p-4 border-b">
        <div className="flex justify-end text-gray-500">
          <h2>better-auth</h2>
        </div>
        {isPending ? (
          <p className="text-sm text-gray-500">Loading…</p>
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
