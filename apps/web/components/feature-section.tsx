export function FeatureSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      {children}
    </div>
  );
}

// a bus line between sections rather than a box edge, so the page reads as
// stacked modules
export function SectionRule() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-600/60 to-transparent dark:via-cyan-400/60"
    />
  );
}

export function FeatureIndex({ value }: { value: string }) {
  return (
    <span className="mr-3 font-mono text-cyan-600 dark:text-cyan-400">
      {value}
    </span>
  );
}
