export default {
  filename: "apps/web/app/auth-form.tsx",
  template: `'use client';

import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@<%= projectName %>/ui/button';

export function AuthForm() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signup');
  const [error, setError] = useState('');

  const form = useForm({
    defaultValues: { name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setError('');
      if (tab === 'signin') {
        const { error } = await authClient.signIn.email(value);
        if (error) setError(error.message ?? 'Sign in failed');
      } else {
        const { error } = await authClient.signUp.email(value);
        if (error) setError(error.message ?? 'Sign up failed');
      }
    },
  });

  return (
    <>
      <div className="flex gap-2 mb-6 text-sm">
        <button
          onClick={() => setTab('signup')}
          className={
            tab === 'signup'
              ? 'font-semibold'
              : 'text-muted-foreground hover:text-gray-200'
          }
        >
          Sign up
        </button>
        <span className="text-gray-600">|</span>
        <button
          onClick={() => setTab('signin')}
          className={
            tab === 'signin'
              ? 'font-semibold'
              : 'text-muted-foreground hover:text-gray-200'
          }
        >
          Sign in
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {tab === 'signup' && (
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  className="flex h-9 w-full rounded-md border border-neutral-700 bg-muted/50 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-neutral-500 focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500/20"
                />
              </div>
            )}
          </form.Field>
        )}

        <form.Field name="email">
          {(field) => (
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="flex h-9 w-full rounded-md border border-neutral-700 bg-muted/50 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-neutral-500 focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500/20"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                minLength={8}
                className="flex h-9 w-full rounded-md border border-neutral-700 bg-muted/50 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-neutral-500 focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500/20"
              />
            </div>
          )}
        </form.Field>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting
                ? 'Loading…'
                : tab === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </>
  );
}`,
};
