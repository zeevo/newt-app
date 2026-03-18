export default {
  filename: "apps/web/app/auth-form.tsx",
  template: `'use client';

import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { Button } from '@<%= projectName %>/ui/button';

export function AuthForm() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
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
          onClick={() => setTab('signin')}
          className={
            tab === 'signin'
              ? 'font-semibold'
              : 'text-gray-400 hover:text-gray-200'
          }
        >
          Sign in
        </button>
        <span className="text-gray-600">|</span>
        <button
          onClick={() => setTab('signup')}
          className={
            tab === 'signup'
              ? 'font-semibold'
              : 'text-gray-400 hover:text-gray-200'
          }
        >
          Sign up
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
                  className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 text-sm"
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
                className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 text-sm"
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
                className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 text-sm"
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
