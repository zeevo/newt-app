import type { Versions } from "./versions";

export type TemplateData = {
  projectName: string;
  nestDiOnly: boolean;
  testing: "jest" | "vitest";
  database: "sqlite" | "postgres";
  deployment: "none" | "standalone" | "spa";
  linter: "eslint" | "oxc";
  antiSlop: boolean;
  shadcn: boolean;
  authSecret: string;
  versions: Versions;
};
// Every option a template can select on. Kept separate from TemplateData
// because these steer *which* template is used, not what it renders.
export type Selection = {
  deployment: "none" | "standalone" | "spa";
  nestDiOnly: boolean;
  todoExample: boolean;
  shadcn: boolean;
  stylex: boolean;
  database: "sqlite" | "postgres";
};

// Everything `selectModules` reads: `Selection` plus the options that only ever
// swap one whole module for another and never reach a `when` predicate.
export type ModuleSelection = Selection & {
  testing: TemplateData["testing"];
  linter: "eslint" | "oxc";
  extras: readonly Extra[];
};

export type Extra = "anti-slop";

// `when` makes precedence explicit: exactly one template may claim a filename
// for a given selection, so no template can silently overwrite another.
export type Template = {
  filename: string;
  template: string;
  when?: (selection: Selection) => boolean;
};
export type File = { src: string; filename: string };
export type Package = {
  package: string;
  module: string;
  version: string;
  dev?: boolean;
};
export type Script = { module: string; name: string; script: string };
export type Module = {
  templates: Template[];
  staticFiles?: File[];
  packages?: Package[];
  scripts?: Script[];
};
