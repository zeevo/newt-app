export function FeatureSection({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      {eyebrow ? (
        <div className="flex items-center gap-4">
          <span className="eyebrow shrink-0">{eyebrow}</span>
          <span className="rule h-px flex-1 border-t" />
        </div>
      ) : null}
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}
