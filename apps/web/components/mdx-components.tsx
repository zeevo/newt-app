// @ts-ignore

import { PropsWithChildren } from 'react';
import { CodeBlock } from './code-block';
import { HeadingWithAnchor } from './heading-with-anchor';
import NextLink, { LinkProps } from 'next/link';
import { cn } from '@newt-app/ui/lib/utils';
import { CopyButton } from './copy-button';
import { Check, Clipboard } from 'lucide-react';
import Pre from './pre';
import { useTheme } from 'next-themes';
import { FileTree } from './file-tree';

interface MDXHeadingProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

function generateId(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  if (Array.isArray(children)) {
    return children.map((child) => generateId(child)).join('-');
  }
  return '';
}

export const mdxComponents = {
  FileTree,
  h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
    <h1
      className={cn(
        'font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<'h2'>) => {
    return (
      <h2
        id={props.children
          ?.toString()
          .replace(/ /g, '-')
          .replace(/'/g, '')
          .replace(/\?/g, '')
          .toLowerCase()}
        className={cn(
          'font-heading mt-8 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-8 [&+p]:!mt-4 *:[code]:text-xl',
          className,
        )}
        {...props}
      />
    );
  },
  h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'font-heading mt-8 scroll-m-28 text-lg font-medium tracking-tight *:[code]:text-xl',
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
    <h4
      className={cn(
        'font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.ComponentProps<'h5'>) => (
    <h5
      className={cn(
        'mt-8 scroll-m-28 text-base font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.ComponentProps<'h6'>) => (
    <h6
      className={cn(
        'mt-8 scroll-m-28 text-base font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<'p'>) => (
    <p
      className={cn('leading-relaxed [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn('font-medium', className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<'li'>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn('rounded-md', className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.ComponentProps<'hr'>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.ComponentProps<'table'>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className={cn(
          'relative w-full overflow-hidden border-none text-sm',
          className,
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
    <tr
      className={cn('last:border-b-none m-0 border-b', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<'th'>) => (
    <th
      className={cn(
        'px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<'td'>) => (
    <td
      className={cn(
        'px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  pre: Pre,

  figure: ({
    className,
    ...props
  }: React.ComponentProps<'figure'> & {
    'data-rehype-pretty-code-figure'?: string;
  }) => {
    return (
      <figure
        className={cn('my-4 rounded-lg bg-accent dark:bg-zinc-900', className)}
        {...props}
      />
    );
  },
  figcaption: ({
    className,
    children,
    ...props
  }: React.ComponentProps<'figcaption'>) => {
    return (
      <figcaption
        className={cn(
          'text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70',
          className,
        )}
        {...props}
      >
        {children}
      </figcaption>
    );
  },
  code: ({
    className,

    ...props
  }: React.ComponentProps<'code'>) => {
    // Inline Code.
    if (typeof props.children === 'string') {
      return (
        <code
          className={cn(
            'bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none',
            className,
          )}
          {...props}
        />
      );
    }

    return (
      <>
        {/* {__raw__ && <CopyButton value={__raw__} src={__src__} />} */}
        <code {...props} />
      </>
    );
  },
  a(
    props: PropsWithChildren<
      LinkProps & { className?: string; active?: boolean }
    >,
  ) {
    const { href, children, className, ...rest } = props;

    return (
      <NextLink
        href={href}
        {...rest}
        className={cn(
          'text-foreground underline decoration-muted-foreground hover:text-foreground hover:decoration-foreground',
          className,
        )}
      >
        {children}
      </NextLink>
    );
  },
};
