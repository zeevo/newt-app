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
// apps/api/src/app.module.ts varies along three independent axes (controllers
// vs DI-only, todo example, spa), which as whole-file templates meant one file
// per combination and the spa block copy-pasted between them. Modules declare
// only their own additions here and a single renderer assembles the file.
export type NestModuleContribution = {
  importStatements?: string[];
  imports?: string[];
  controllers?: string[];
  providers?: string[];
};

export type Module = {
  templates: Template[];
  appModule?: NestModuleContribution;
  staticFiles?: File[];
  packages?: Package[];
  scripts?: Script[];
};
