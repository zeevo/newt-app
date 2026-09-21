import { cn } from "@newt-app/ui/lib/utils";

export function Pipeline({
  steps,
  className,
}: {
  steps: readonly { code: string; body: React.ReactNode }[];
  className?: string;
}) {
  return (
    <ol className={cn("grid gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li key={step.code} className="relative rounded-lg border bg-card p-5">
          <span className="absolute -top-3.5 left-5 grid size-7 place-items-center rounded-full bg-amber-600 font-mono text-xs font-bold text-white tabular-nums">
            {i + 1}
          </span>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute top-1/2 -right-4 hidden h-px w-4 bg-amber-500/60 lg:block"
            />
          )}
          <code className="mt-1 block font-mono text-sm font-semibold text-amber-800 dark:text-amber-300">
            {step.code}
          </code>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
