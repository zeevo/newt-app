import { nextJsConfig } from '@newt-app/eslint-config/next-js';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: '../../packages/ui/src/styles/globals.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
    },
  },
];
