import { highlightCode } from "@/lib/highlight-code";

interface CodeShowcaseProps {
  code: string;
  language?: string;
  filename?: string;
}

export async function CodeShowcase({
  code,
  language = "tsx",
  filename,
}: CodeShowcaseProps) {
  const html = await highlightCode(code, language);
  const cut = filename ? filename.lastIndexOf("/") + 1 : 0;

  return (
    <div className="overflow-hidden rounded-none border border-l-2 border-cyan-600/30 border-l-cyan-600 bg-code dark:border-cyan-400/30 dark:border-l-cyan-400">
      {filename && (
        <div className="flex items-center gap-2.5 border-b border-cyan-600/20 px-4 py-2 font-mono text-xs dark:border-cyan-400/20">
          <span
            aria-hidden
            className="size-1.5 shrink-0 bg-cyan-600 dark:bg-cyan-400"
          />
          {/* the directory greys back so the file the snippet is about reads
              first, the way a breadcrumb in an editor tab does */}
          <span className="truncate text-muted-foreground">
            {filename.slice(0, cut)}
            <span className="text-foreground">{filename.slice(cut)}</span>
          </span>
          <span className="ml-auto shrink-0 tracking-widest text-cyan-600 uppercase dark:text-cyan-400">
            {language}
          </span>
        </div>
      )}
      <div
        className="overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
