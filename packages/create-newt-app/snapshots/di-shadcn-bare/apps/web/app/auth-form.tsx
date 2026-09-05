'use client';

import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@my-app/ui/button';
import { Input } from '@my-app/ui/input';
import { Label } from '@my-app/ui/label';

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
      <div className="flex gap-1 mb-6">
        <Button
          type="button"
          variant={tab === 'signup' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTab('signup')}
        >
          Sign up
        </Button>
        <Button
          type="button"
          variant={tab === 'signin' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTab('signin')}
        >
          Sign in
        </Button>
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
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          </form.Field>
        )}

        <form.Field name="email">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={
                  tab === 'signin' ? 'current-password' : 'new-password'
                }
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                minLength={8}
              />
            </div>
          )}
        </form.Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

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
}