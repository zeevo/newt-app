'use client';

import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { authClient } from '@/lib/auth-client';
import { Button } from '@my-app/ui/button';
import { colors, radii } from '@my-app/ui/tokens.stylex';

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
      <div {...stylex.props(styles.tabs)}>
        <button
          onClick={() => setTab('signup')}
          {...stylex.props(styles.tab, tab === 'signup' && styles.tabActive)}
        >
          Sign up
        </button>
        <span {...stylex.props(styles.divider)}>|</span>
        <button
          onClick={() => setTab('signin')}
          {...stylex.props(styles.tab, tab === 'signin' && styles.tabActive)}
        >
          Sign in
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        {...stylex.props(styles.form)}
      >
        {tab === 'signup' && (
          <form.Field name="name">
            {(field) => (
              <div {...stylex.props(styles.field)}>
                <label {...stylex.props(styles.label)}>Name</label>
                <input
                  type="text"
                  autoComplete="name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  {...stylex.props(styles.input)}
                />
              </div>
            )}
          </form.Field>
        )}

        <form.Field name="email">
          {(field) => (
            <div {...stylex.props(styles.field)}>
              <label {...stylex.props(styles.label)}>Email</label>
              <input
                type="email"
                autoComplete="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                {...stylex.props(styles.input)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div {...stylex.props(styles.field)}>
              <label {...stylex.props(styles.label)}>Password</label>
              <input
                type="password"
                autoComplete={
                  tab === 'signin' ? 'current-password' : 'new-password'
                }
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                minLength={8}
                {...stylex.props(styles.input)}
              />
            </div>
          )}
        </form.Field>

        {error && <p {...stylex.props(styles.error)}>{error}</p>}

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting} style={styles.submit}>
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

const styles = stylex.create({
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  tab: {
    color: {
      default: colors.mutedForeground,
      ':hover': colors.foreground,
    },
    backgroundColor: 'transparent',
    borderStyle: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  tabActive: {
    color: colors.foreground,
    fontWeight: 600,
  },
  divider: {
    color: colors.border,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    height: 36,
    paddingBlock: '0.25rem',
    paddingInline: '0.75rem',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    color: colors.foreground,
    backgroundColor: 'oklch(0.269 0 0 / 0.5)',
    borderColor: {
      default: colors.border,
      ':focus-visible': colors.mutedForeground,
    },
    borderRadius: radii.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    outlineStyle: 'none',
    transitionProperty: 'border-color',
    transitionDuration: '150ms',
  },
  error: {
    fontSize: '0.875rem',
    color: colors.danger,
  },
  submit: {
    width: '100%',
  },
});
