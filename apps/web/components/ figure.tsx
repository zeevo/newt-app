'use client';

import * as React from 'react';
import { cn } from '@newt-app/ui/lib/utils';

const PrettyCodeFigure = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'figure'>
>(({ className, children, ...rest }, ref) => {
  return (
    <figure
      ref={ref}
      className={cn('my-4', className)}
      {...rest}
      data-theme={'dark'}
    >
      {children}
    </figure>
  );
});

PrettyCodeFigure.displayName = 'PrettyCodeFigure';
export default PrettyCodeFigure;
