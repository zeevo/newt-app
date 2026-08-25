import { highlightCode } from "@/lib/highlight-code";

interface CodeShowcaseProps {
  code: string;
  language?: string;
  filename?: string;
}

export async function CodeShowcase({ code, language = "tsx", filename }: CodeShowcaseProps) {
  const html = await highlightCode(code, language);

  return (
    <div className="border bg-code">
      {filename && (
        <div className="flex items-center gap-3 border-b px-4 py-2 font-mono text-xs">
          <span className="h-3 w-0.5 shrink-0 bg-brand" />
          <span className="truncate text-muted-foreground">{filename}</span>
          <span className="ml-auto shrink-0 tracking-[0.2em] text-muted-foreground/60 uppercase">
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
