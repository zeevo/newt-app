import type { Versions } from "./versions";

export type TemplateData = {
  projectName: string;
  testing: "jest" | "vitest";
  database: "sqlite" | "postgres";
  deployment: "none" | "standalone" | "custom-server" | "spa";
  authSecret: string;
  versions: Versions;
};
// How NestJS runs: an HTTP server on its own port, or an application context
// with no server that Next.js route handlers resolve services out of.
export type Mode = "full" | "nest-di-only";

// Every option a template can select on. Kept separate from TemplateData
// because these steer *which* template is used, not what it renders.
export type Selection = {
  deployment: "none" | "standalone" | "custom-server" | "spa";
  mode: Mode;
  includeExample: boolean;
  shadcn: boolean;
  database: "sqlite" | "postgres";
};

// Everything `selectModules` reads: `Selection` plus the options that only ever
// swap one whole module for another and never reach a `when` predicate.
export type ModuleSelection = Selection & {
  testing: TemplateData["testing"];
  linter: "eslint" | "oxc";
};

// `when` makes precedence explicit: exactly one template may claim a filename
// for a given selection, so no template can silently overwrite another.
export type Template = {
  filename: string;
  template: string;
  when?: (selection: Selection) => boolean;
};
export type File = { src: string; filename: string };
// `when` here does for injected deps and scripts what it already does for
// templates: a module can target a workspace that only some selections emit.
export type Package = {
  package: string;
  module: string;
  version: string;
  dev?: boolean;
  when?: (selection: Selection) => boolean;
};
export type Script = {
  module: string;
  name: string;
  script: string;
  when?: (selection: Selection) => boolean;
};
export type Module = {
  templates: Template[];
  staticFiles?: File[];
  packages?: Package[];
  scripts?: Script[];
};
