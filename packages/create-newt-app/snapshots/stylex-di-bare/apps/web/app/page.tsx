'use client';

import { useQuery } from '@tanstack/react-query';
import * as stylex from '@stylexjs/stylex';
import { authClient } from '@/lib/auth-client';
import { AuthForm } from '@/app/auth-form';
import { Button } from '@my-app/ui/button';
import { Link } from '@my-app/ui/link';
import { Logo } from '@my-app/ui/logo';
import { colors, fonts, radii } from '@my-app/ui/tokens.stylex';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const { data: hello } = useQuery({
    queryKey: ['hello'],
    queryFn: () => fetch('/api/hello').then((r) => r.json()),
  });

  return (
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.header)}>
        <p {...stylex.props(styles.mono, styles.muted)}>apps/web/app/page.tsx</p>
        <p {...stylex.props(styles.muted)}>Delete me to get started!</p>
      </div>

      <div {...stylex.props(styles.titleRow)}>
        <Logo style={styles.logo} />
        <div>
          <h1 {...stylex.props(styles.h1)}>my-app</h1>
          <p {...stylex.props(styles.muted, styles.tagline)}>
            Next + Nest = Newt 💜
          </p>
        </div>
      </div>

      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.eyebrow)}>next.js</p>
        <p {...stylex.props(styles.mono, styles.muted)}>apps/web/app/layout.tsx</p>
        <p {...stylex.props(styles.muted)}>Next.js rendering</p>
      </div>

      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.eyebrow)}>nest.js</p>
        <p {...stylex.props(styles.mono, styles.muted)}>GET /api/hello</p>
        <pre {...stylex.props(styles.pre)}>
          <code>{JSON.stringify(hello, null, 2)}</code>
        </pre>
      </div>

      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.eyebrow, styles.eyebrowSpaced)}>better-auth</p>
        {isPending ? (
          <p {...stylex.props(styles.muted)}>Loading…</p>
        ) : session ? (
          <div {...stylex.props(styles.signedIn)}>
            <p>Signed in as {session.user.name}</p>
            <Button onClick={() => void authClient.signOut()}>
              Sign out
            </Button>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>

      <div {...stylex.props(styles.footer)}>
        <p {...stylex.props(styles.muted)}>Learn more</p>
        <ul {...stylex.props(styles.list)}>
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

const styles = stylex.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '32rem',
    minHeight: '100%',
    marginInline: 'auto',
    paddingBlock: '2rem',
    paddingInline: '1rem',
    fontSize: '0.875rem',
  },
  header: {
    paddingBottom: '1rem',
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBlock: '0.5rem',
  },
  logo: {
    width: '2.5rem',
    height: 'auto',
  },
  h1: {
    fontSize: '2.25rem',
    fontWeight: 900,
    letterSpacing: '-0.025em',
  },
  tagline: {
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '1.5rem',
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: colors.mutedForeground,
  },
  eyebrowSpaced: {
    marginBottom: '0.75rem',
  },
  pre: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    fontFamily: fonts.mono,
    backgroundColor: 'oklch(0.269 0 0 / 0.5)',
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    overflowX: 'auto',
  },
  signedIn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingBlock: '1rem',
    paddingInline: '0.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    listStylePosition: 'inside',
    listStyleType: 'disc',
  },
  mono: {
    fontFamily: fonts.mono,
  },
  muted: {
    color: colors.mutedForeground,
  },
});
