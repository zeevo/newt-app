import * as React from 'react';

import { CopyButton } from '@/components/copy-button';
import { cn } from '@newt-app/ui/lib/utils';
import { highlightCode } from '@/lib/highlight-code';

export async function ComponentSource({
  name,
  src,
  title,
  language,
  className,
}: React.ComponentProps<'div'> & {
  name?: string;
  src?: string;
  title?: string;
  language?: string;
  collapsible?: boolean;
}) {
  if (!name && !src) {
    return null;
  }

  const code = "console.log('here');\nconst a = 1+1=;";

  const lang = language ?? title?.split('.').pop() ?? 'tsx';
  const highlightedCode = await highlightCode(code, lang);

  return (
    <div className={cn('relative', className)}>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </div>
  );
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string;
  highlightedCode: string;
  language: string;
  title: string | undefined;
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {title}
        </figcaption>
      )}
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  );
}
