export function FeatureSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      {children}
    </div>
  );
}
