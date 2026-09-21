import { WindowFrame } from "@/components/window-frame";

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "const",
  "return",
  "async",
  "new",
  "type",
  "default",
]);

const TOKEN =
  /('[^']*'|"[^"]*"|\/\/[^\n]*|\b(?:import|export|from|const|return|async|new|type|default)\b)/g;

export function CodeBlock({ label, tag, code }: { label: string; tag?: string; code: string }) {
  return (
    <WindowFrame label={label} tag={tag} bodyClassName="bg-code">
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
        <code>
          {code
            .split(TOKEN)
            .filter(Boolean)
            .map((part, i) => {
              if (part.startsWith("//")) {
                return (
                  <span key={i} className="text-muted-foreground/60 italic">
                    {part}
                  </span>
                );
              }
              if (part.startsWith("'") || part.startsWith('"')) {
                return (
                  <span key={i} className="text-emerald-700 dark:text-emerald-400">
                    {part}
                  </span>
                );
              }
              if (KEYWORDS.has(part)) {
                return (
                  <span key={i} className="text-amber-700 dark:text-amber-400">
                    {part}
                  </span>
                );
              }
              return part;
            })}
        </code>
      </pre>
    </WindowFrame>
  );
}
