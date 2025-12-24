import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    // TODO: Fix type error. Introduced when setting up Turborepo.
    // @eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error: ?
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
