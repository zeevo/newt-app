#!/usr/bin/env node
// Script to generate shadcn-ui template files from live packages/ui components
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = '/Users/zeevo/Projects/some-work/newt-app';
const COMPONENTS_DIR = join(ROOT, 'packages/ui/src/components');
const TEMPLATES_OUT = join(ROOT, 'packages/templates/src/shadcn-ui/templates');

mkdirSync(TEMPLATES_OUT, { recursive: true });

function toVarName(filename) {
  // accordion.tsx -> accordion
  // alert-dialog.tsx -> alertDialog
  return filename.replace('.tsx', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function escape(str) {
  // Escape backticks and ${} for template literal
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

const componentFiles = readdirSync(COMPONENTS_DIR).filter(f => f.endsWith('.tsx')).sort();

const imports = [];
const templateEntries = [];

for (const filename of componentFiles) {
  const fullPath = join(COMPONENTS_DIR, filename);
  const content = readFileSync(fullPath, 'utf-8');

  // Substitute @newt-app/ -> @<%= projectName %>/
  const substituted = content.replace(/@newt-app\//g, '@<%= projectName %>/');
  const escaped = escape(substituted);

  const varName = toVarName(filename);
  const componentName = filename.replace('.tsx', '');
  const outputPath = `packages/ui/src/components/${filename}`;

  const templateContent = `export default {
  filename: "${outputPath}",
  template: \`${escaped}\`,
};
`;

  const outFile = join(TEMPLATES_OUT, `${componentName}.ts`);
  writeFileSync(outFile, templateContent, 'utf-8');

  imports.push(`import ${varName} from "./templates/${componentName}";`);
  templateEntries.push(`  ${varName},`);

  console.log(`Generated: ${componentName}.ts`);
}

console.log('\n--- imports for index.ts ---');
console.log(imports.join('\n'));
console.log('\n--- template entries ---');
console.log(templateEntries.join('\n'));
