import { highlightCode } from "@/lib/highlight-code";

interface CodeShowcaseProps {
  code: string;
  language?: string;
  filename?: string;
}

export async function CodeShowcase({ code, language = "tsx", filename }: CodeShowcaseProps) {
  const html = await highlightCode(code, language);

  return (
    <div className="overflow-hidden rounded-lg border bg-code">
      {filename && (
        <div className="border-b px-4 py-2 font-mono text-xs text-muted-foreground">{filename}</div>
      )}
      <div
        className="overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
