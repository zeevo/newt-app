import { cn } from '@newt-app/ui/lib/utils';

export function InlineCode({
  className,
  ...props
}: React.ComponentProps<'code'>) {
  return (
    <code
      className={cn(
        'bg-muted text-foreground relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none',
        className,
      )}
      {...props}
    />
  );
}
