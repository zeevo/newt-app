'use client';

import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@newt-app/ui/components/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@newt-app/ui/components/popover';
import { cn } from '@newt-app/ui/lib/utils';

export function MobileNav({
  items,
  className,
}: {
  items: { href: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              'extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent',
              className,
            )}
          />
        }
      >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
                  open ? 'top-[0.4rem] -rotate-45' : 'top-1',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
                  open ? 'top-[0.4rem] rotate-45' : 'top-2.5',
                )}
              />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>
          <span className="flex h-8 items-center text-lg leading-none font-medium">
            Menu
          </span>
      </PopoverTrigger>
      <PopoverContent
        className="no-scrollbar flex h-(--available-height) w-(--available-width) flex-col overflow-hidden rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={14}
      >
        {/* min-h-0 lets this shrink below its content so it can actually
            scroll; without it the links overflow the popover unreachably */}
        <div className="flex min-h-0 flex-1 flex-col gap-12 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Menu
            </div>
            <div className="flex flex-col gap-3">
              <MobileLink href="/" onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item, index) => (
                <MobileLink key={index} href={item.href} onOpenChange={setOpen}>
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn('text-2xl font-medium', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
