// Guards against malformed Tailwind class names in scaffolder templates.
//
// Lint runs on the monorepo, not on scaffolded output, and it cannot catch
// invalid Tailwind class strings anyway. A double opacity modifier like
// `bg-muted/50/50` silently produces no style, so it ships unnoticed
// (see the bug fixed alongside this guard). This scan fails CI on that pattern.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEMPLATES_DIR = fileURLToPath(
  new URL('../packages/create-newt-app/src/templates', import.meta.url),
);

// A utility token (starts with a letter) carrying two `/number` modifiers,
// e.g. `bg-muted/50/50`. The leading-letter anchor excludes dates/paths.
const DOUBLE_MODIFIER = /[a-zA-Z][\w:-]*\/\d{1,3}\/\d{1,3}/;

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (full.endsWith('.ts')) files.push(full);
  }
  return files;
}

const violations = [];
for (const file of walk(TEMPLATES_DIR)) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const token of line.split(/[\s"'`{}<>]+/)) {
        if (DOUBLE_MODIFIER.test(token)) {
          violations.push({ file, line: i + 1, token });
        }
      }
    });
}

if (violations.length > 0) {
  console.error('Malformed Tailwind class names found in templates:\n');
  for (const { file, line, token } of violations) {
    console.error(`  ${file}:${line}  ${token}`);
  }
  console.error(
    '\nA class may carry at most one opacity modifier (e.g. `bg-muted/50`).',
  );
  process.exit(1);
}

console.log('Template class check passed.');
