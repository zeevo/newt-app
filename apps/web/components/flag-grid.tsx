export function FlagGrid({ flags }: { flags: readonly { flag: string; body: React.ReactNode }[] }) {
  return (
    <dl className="mt-10 grid gap-x-10 gap-y-7 border-t border-dashed pt-9 sm:grid-cols-2 lg:grid-cols-3">
      {flags.map((entry) => (
        <div key={entry.flag}>
          <dt className="font-mono text-sm font-semibold text-amber-800 dark:text-amber-300">
            {entry.flag}
          </dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{entry.body}</dd>
        </div>
      ))}
    </dl>
  );
}
