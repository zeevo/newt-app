export type Config = {
  shadcn: boolean;
  testing: 'jest' | 'vitest';
  database: 'sqlite' | 'postgres';
  linter: 'eslint' | 'oxc';
  deployment: 'none' | 'standalone' | 'custom-server' | 'spa';
  nestDiOnly: boolean;
};

// Both pairs are rejected by validateDeploymentCombo in create-newt-app, so the
// builder must not offer them — the emitted command would just error.
export const DI_ONLY_REJECTS = new Set<Config['deployment']>([
  'spa',
  'custom-server',
]);

export const DI_ONLY_REJECTS_HINT =
  'spa and custom-server are hidden here: each already runs Nest inside Next.js, and the CLI rejects that pair.';

export const DEPLOYMENT_HINTS: Record<Config['deployment'], string> = {
  none: 'No deployment files. Next.js serves :3000 and Nest serves :3001, with a rewrite forwarding /api/* to Nest, so you deploy the two apps yourself.',
  standalone:
    'A multi-stage Dockerfile builds web, api, and migrate containers, orchestrated by docker-compose. Next.js builds with output: "standalone" and proxies /api/* to Nest. Runs on Railway, Fly.io, Render, or ECS.',
  'custom-server':
    'A custom Node entry point boots Next.js and Nest in the same process. /api/* is dispatched to Nest, everything else to Next.js. One process, one port, no proxy.',
  spa: 'Next.js builds as a static export and Nest serves the files with ServeStaticModule. One process and one port, but no server-side rendering.',
};

// With di-only there is no second process, so the ":3001" story above is wrong.
const NONE_DI_ONLY_HINT =
  'No deployment files. Nest runs inside the Next.js process, so the app stays one Next.js project on :3000 that any Next.js host will run.';

export function deploymentHint(c: Config): string {
  const base =
    c.deployment === 'none' && c.nestDiOnly
      ? NONE_DI_ONLY_HINT
      : DEPLOYMENT_HINTS[c.deployment];
  return c.nestDiOnly ? `${base} ${DI_ONLY_REJECTS_HINT}` : base;
}

export const DI_ONLY_HINT =
  'Nest runs as an application context with no HTTP server, and Next.js route handlers resolve its services through inject(). The app stays a single Next.js project, so it deploys to Vercel with no extra infrastructure.';

export const DATABASE_HINT =
  'SQLite writes to a local file, which is not persisted on serverless filesystems like Vercel’s. Better Auth and your app share one Kysely connection either way.';

const DEPLOYMENTS = [
  'none',
  'standalone',
  'custom-server',
  'spa',
] as const satisfies readonly Config['deployment'][];

export function deploymentOptions(
  nestDiOnly: boolean,
): readonly Config['deployment'][] {
  return DEPLOYMENTS.filter(
    (deployment) => !(nestDiOnly && DI_ONLY_REJECTS.has(deployment)),
  );
}

export function buildCommand(c: Config): string {
  const flags: string[] = [];
  if (c.shadcn) flags.push('--shadcn');
  if (c.testing !== 'jest') flags.push('--testing vitest');
  if (c.database !== 'sqlite') flags.push('--database postgres');
  if (c.linter !== 'eslint') flags.push('--linter oxc');
  if (c.deployment !== 'none') flags.push(`--deployment ${c.deployment}`);
  if (c.nestDiOnly) flags.push('--nest-di-only');
  // Passing a config flag is what puts the CLI in non-interactive mode. Every
  // other option here matches its default, so without this the CLI would prompt
  // and shadcn would come back on — the opposite of what the panel shows.
  if (!flags.length && !c.shadcn) flags.push('--testing jest');
  return flags.length
    ? `npm create newt-app my-app -- ${flags.join(' ')}`
    : 'npm create newt-app my-app';
}
