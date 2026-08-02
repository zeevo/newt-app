import type { Module, Selection, Template } from "./templates/types.js";
import type { ValidationResult } from "./utils.js";

// Which module contributed a template, for error messages only.
type Candidate = { template: Template; module: string };

function candidatesByFilename(
  modules: Module[],
  nameOf: Map<Module, string>,
): Map<string, Candidate[]> {
  return modules.reduce((byFilename, mod, index) => {
    const module = nameOf.get(mod) ?? `module #${index}`;
    mod.templates.forEach((template) => {
      const existing = byFilename.get(template.filename) ?? [];
      byFilename.set(template.filename, [...existing, { template, module }]);
    });
    return byFilename;
  }, new Map<string, Candidate[]>());
}

// Exactly one template must claim each filename. Zero means an option removed
// every candidate; more than one means two modules both think they own the
// file, which used to resolve silently by composition order.
export function selectTemplates(
  modules: Module[],
  selection: Selection,
  nameOf: Map<Module, string> = new Map(),
): { templates: Template[]; result: ValidationResult } {
  const entries = [...candidatesByFilename(modules, nameOf).entries()];

  const problems = entries.flatMap(([filename, candidates]) => {
    const matching = candidates.filter(
      ({ template }) => template.when?.(selection) ?? true,
    );
    if (matching.length === 1) return [];

    const from = (list: Candidate[]) =>
      list.map(({ module }) => module).join(", ");

    return matching.length === 0
      ? [
          `No template claims ${filename} for this selection. ` +
            `Candidates that opted out: ${from(candidates)}.`,
        ]
      : [
          `${matching.length} templates claim ${filename} for this selection: ` +
            `${from(matching)}. Exactly one must apply — narrow their \`when\`.`,
        ];
  });

  if (problems.length) {
    return { templates: [], result: { valid: false, error: problems.join("\n") } };
  }

  const templates = entries.flatMap(([, candidates]) =>
    candidates
      .filter(({ template }) => template.when?.(selection) ?? true)
      .map(({ template }) => template),
  );

  return { templates, result: { valid: true } };
}
