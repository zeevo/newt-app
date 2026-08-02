import type { Module, NestModuleContribution } from "./templates/types.js";

const KEYS = ["imports", "controllers", "providers"] as const;

function block(key: string, entries: string[]): string {
  // one line while it fits, matching how these were written by hand
  const inline = `  ${key}: [${entries.join(", ")}],`;
  if (inline.length <= 80 && !entries.some((entry) => entry.includes("\n"))) {
    return inline;
  }
  return `  ${key}: [\n${entries.map((entry) => `    ${entry},`).join("\n")}\n  ],`;
}

// Merge every module's contribution in composition order, then render. Order
// within a list follows the order modules were composed, so the output is
// deterministic without depending on which module happens to own the file.
export function renderAppModule(modules: Module[]): string {
  const contributions = modules
    .map((mod) => mod.appModule)
    .filter((contribution): contribution is NestModuleContribution =>
      contribution !== undefined,
    );

  const collect = (key: keyof NestModuleContribution) =>
    contributions.flatMap((contribution) => contribution[key] ?? []);

  // contributions arrive in composition order, which would interleave local
  // and package imports; group them the way the hand-written files were
  const rank = (statement: string) => {
    const specifier = statement.match(/from '([^']+)'/)?.[1] ?? "";
    if (specifier.startsWith(".")) return 3;
    if (specifier.startsWith("@<%=")) return 2;
    if (specifier.includes("/")) return 1;
    return 0;
  };

  const importStatements = collect("importStatements")
    .filter((statement, index, all) => all.indexOf(statement) === index)
    .map((statement, index) => ({ statement, index }))
    .sort((a, b) => rank(a.statement) - rank(b.statement) || a.index - b.index)
    .map(({ statement }) => statement);

  const body = KEYS.map((key) => ({ key, entries: collect(key) }))
    .filter(({ entries }) => entries.length > 0)
    .map(({ key, entries }) => block(key, entries))
    .join("\n");

  return `${importStatements.join("\n")}

@Module({
${body}
})
export class AppModule {}`;
}
