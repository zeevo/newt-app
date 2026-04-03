export default {
  filename: "packages/ui/src/components/skeleton.tsx",
  template: `import { cn } from '@<%= projectName %>/ui/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
`,
};
