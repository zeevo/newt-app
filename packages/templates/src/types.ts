export type TemplateData = { projectName: string };
export type Template = { filename: string; template: string };
export type File = { src: string; filename: string };
export type Package = { package: string; module: string; version: string; dev?: boolean };
export type Script = { module: string; name: string; script: string };
export type Module = {
  templates: Template[];
  staticFiles?: File[];
  packages?: Package[];
  scripts?: Script[];
};
