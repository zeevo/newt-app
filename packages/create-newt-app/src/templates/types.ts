export type TemplateData = {
  projectName: string;
  testing: 'jest' | 'vitest';
  database: 'sqlite' | 'postgres';
  deployment: 'none' | 'standalone' | 'custom-server' | 'spa';
  authSecret: string;
};
export type Template = { filename: string; template: string };
export type File = { src: string; filename: string };
export type Package = { package: string; module: string; version: string; dev?: boolean };
export type Script = { module: string; name: string; script: string };
// A module may legitimately rewrite a file an earlier module produced, but it
// has to say whose version it is replacing — naming only the file would let a
// third module silently discard the override in between.
export type Override = { file: string; from: string };
export type Module = {
  // set automatically from the registry key in templates/index.ts
  name?: string;
  templates: Template[];
  overrides?: Override[];
  staticFiles?: File[];
  packages?: Package[];
  scripts?: Script[];
};
