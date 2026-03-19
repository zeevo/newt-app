'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@newt-app/ui/lib/utils';

type PrettyCodeFigureProps = React.ComponentPropsWithoutRef<'figure'> & {
  /**
   * If provided, forces this figure to use a specific site theme
   * regardless of the global theme. Useful for demos.
   */
  forceTheme?: 'light' | 'dark';
  /**
   * If true, allow a passed `data-theme` prop to override the computed one.
   * Default: false (the computed site theme wins).
   */
  allowPropOverride?: boolean;
};

/**
 * Wraps code blocks emitted by `rehype-pretty-code`.
 * Sets `data-theme` so the correct Shiki palette (light/dark) is used.
 */
const PrettyCodeFigure = React.forwardRef<HTMLElement, PrettyCodeFigureProps>(
  (
    { className, forceTheme, allowPropOverride = false, children, ...rest },
    ref,
  ) => {
    const { resolvedTheme } = useTheme();

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
  },
);

PrettyCodeFigure.displayName = 'PrettyCodeFigure';
export default PrettyCodeFigure;
