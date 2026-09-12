#!/usr/bin/env node
import { intro } from "@clack/prompts";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
import { Command } from "commander";
import * as p from "@clack/prompts";
import { selectModules, type Extra, type ModuleSelection, type Nest } from "./templates";
import { hasCommand, initGit, pnpmFormat, pnpmInstall, scaffold } from "./tasks.js";
import { reportRun } from "./telemetry.js";
import {
  checkRequiredTools,
  normalizeProjectName,
  validateDeploymentCombo,
  validateExampleCombo,
  validateExtrasCombo,
  validateStylingCombo,
  validateFlagValue,
  validateNodeVersion,
  validateProjectName,
} from "./utils.js";

const TESTING_CHOICES = ["jest", "vitest"] as const;
const DATABASE_CHOICES = ["sqlite", "postgres"] as const;
const LINTER_CHOICES = ["eslint", "oxc"] as const;
const DEPLOYMENT_CHOICES = ["none", "standalone", "spa"] as const;
const NEST_CHOICES = ["on", "off", "di-only"] as const satisfies readonly Nest[];
const EXTRAS_CHOICES = ["anti-slop"] as const satisfies readonly Extra[];

type Testing = (typeof TESTING_CHOICES)[number];
type Database = (typeof DATABASE_CHOICES)[number];
type Linter = (typeof LINTER_CHOICES)[number];
type Deployment = (typeof DEPLOYMENT_CHOICES)[number];

type Answers = {
  name?: string;
  shadcn?: boolean;
  stylex?: boolean;
  testing?: Testing;
  database?: Database;
  linter?: Linter;
  deployment?: Deployment;
  nest?: Nest;
  todoExample?: boolean;
  extras?: Extra[];
};

type Options = {
  name?: string;
  install: boolean;
  git: boolean;
  nonInteractive: boolean;
  shadcn: boolean;
  stylex: boolean;
  testing: Testing;
  database: Database;
  linter: Linter;
  deployment: Deployment;
  nest: Nest;
  includeExample: boolean;
  extras: readonly Extra[];
  explicitFlags: readonly string[];
};

class TaskBuilder {
  tasks: p.Task[] = [];

  add(task: p.Task) {
    this.tasks.push(task);
  }
}

export async function doInit(options: Options) {
  const groupOpts = {
    ...(!options.name && {
      name: () =>
        p.text({
          message: "What is your project name?",
          placeholder: "my-newt-app",
          validate: (value) => validateProjectName(value).error,
        }),
    }),
    ...(!options.nonInteractive && {
      shadcn: () =>
        p.confirm({
          message: "Use shadcn/ui?",
          initialValue: true,
        }),
      stylex: ({ results }) =>
        results.shadcn
          ? undefined
          : p.confirm({
              message: "Use StyleX instead of Tailwind?",
              initialValue: false,
            }),
      nest: () =>
        p.select<Nest>({
          message: "NestJS?",
          options: [
            { value: "on", label: "On", hint: "apps/api on port 3001" },
            {
              value: "di-only",
              label: "DI only",
              hint: "no HTTP server; Next.js route handlers inject its services",
            },
            { value: "off", label: "Off", hint: "no apps/api; Next.js owns the backend" },
          ],
          initialValue: "on",
        }),
      // Every testing config, script and dev dependency lands in apps/api,
      // which `off` never scaffolds.
      testing: ({ results }) =>
        results.nest === "off"
          ? undefined
          : p.select<Testing>({
              message: "Testing framework?",
              options: [
                { value: "jest", label: "Jest" },
                { value: "vitest", label: "Vitest" },
              ],
              initialValue: "jest",
            }),
      database: () =>
        p.select<Database>({
          message: "Database?",
          options: [
            { value: "sqlite", label: "SQLite" },
            { value: "postgres", label: "Postgres" },
          ],
          initialValue: "sqlite",
        }),
      linter: () =>
        p.select<Linter>({
          message: "Linter and formatter?",
          options: [
            { value: "eslint", label: "ESLint + Prettier" },
            { value: "oxc", label: "oxlint + oxfmt" },
          ],
          initialValue: "eslint",
        }),
      extras: ({ results }) =>
        results.linter === "oxc"
          ? p.multiselect<Extra>({
              message: "Extras?",
              options: [
                {
                  value: "anti-slop",
                  label: "anti-slop",
                  hint: "oxlint rules that reject low-evidence TypeScript",
                },
              ],
              required: false,
            })
          : undefined,
      // The example is a Nest module either way: a service behind a controller,
      // or behind a route handler that injects it.
      todoExample: ({ results }) =>
        results.nest === "off"
          ? undefined
          : p.confirm({
              message: "Include the todo example?",
              initialValue: true,
            }),
      deployment: ({ results }) =>
        p.select<Deployment>({
          message: "Deployment?",
          options: [
            { value: "none", label: "None", hint: "skip" },
            {
              value: "standalone",
              label: "Standalone + Dockerfile",
              hint: "Dockerfiles + docker-compose.yml",
            },
            // SPA hands a static export to NestJS to serve, so it needs a Nest
            // with its own HTTP server: di-only has none, and off has no Nest
            ...(results.nest === "on"
              ? [
                  {
                    value: "spa" as const,
                    label: "SPA Mode",
                    hint: "static export served by NestJS",
                  },
                ]
              : []),
          ],
          initialValue: "none",
        }),
    }),
  };

  try {
    // Before the prompts, and before anything is written: a missing tool used
    // to surface as a spawn error partway through, leaving a half-scaffolded
    // directory that the next run then refuses to overwrite.
    const preflight = [
      validateNodeVersion(process.version, pkg.engines.node),
      ...(options.name ? [validateProjectName(options.name)] : []),
      await checkRequiredTools({ install: options.install, git: options.git }, hasCommand),
    ].find((result) => !result.valid);

    if (preflight) {
      throw new Error(preflight.error);
    }

    const answers: Answers = await p.group(groupOpts, {
      onCancel: () => {
        console.log("Exiting.");
        process.exit(0);
      },
    });

    const useShadcn = options.nonInteractive ? options.shadcn : (answers.shadcn ?? true);
    const useStylex = options.nonInteractive ? options.stylex : (answers.stylex ?? false);
    const testing: Testing = options.nonInteractive ? options.testing : (answers.testing ?? "jest");
    const database: Database = options.nonInteractive
      ? options.database
      : (answers.database ?? "sqlite");
    const linter: Linter = options.nonInteractive ? options.linter : (answers.linter ?? "eslint");
    const deployment: Deployment = options.nonInteractive
      ? options.deployment
      : (answers.deployment ?? "none");
    const nest: Nest = options.nonInteractive ? options.nest : (answers.nest ?? "on");
    const todoExample = options.nonInteractive
      ? options.includeExample
      : nest !== "off" && (answers.todoExample ?? true);
    const extras: readonly Extra[] = options.nonInteractive
      ? options.extras
      : (answers.extras ?? []);

    const stylingCombo = validateStylingCombo(useShadcn, useStylex);
    if (!stylingCombo.valid) {
      throw new Error(stylingCombo.error);
    }

    const deploymentCombo = validateDeploymentCombo(deployment, nest);
    if (!deploymentCombo.valid) {
      throw new Error(deploymentCombo.error);
    }

    const exampleCombo = validateExampleCombo(todoExample, nest);
    if (!exampleCombo.valid) {
      throw new Error(exampleCombo.error);
    }

    const extrasCombo = validateExtrasCombo(extras, linter);
    if (!extrasCombo.valid) {
      throw new Error(extrasCombo.error);
    }

    const selection: ModuleSelection = {
      deployment,
      nest,
      todoExample,
      shadcn: useShadcn,
      stylex: useStylex,
      database,
      linter,
      testing,
      extras,
    };

    const allModules = selectModules(selection);

    const rawName = answers.name ?? options.name ?? "";

    const nameCheck = validateProjectName(rawName);
    if (!nameCheck.valid) {
      throw new Error(nameCheck.error);
    }

    // Normalized here, not inside scaffold, so the directory, the package scope
    // and the "cd" line below can never disagree.
    const name = normalizeProjectName(rawName);

    const taskBuilder = new TaskBuilder();

    taskBuilder.add({
      title: "Scaffolding project",
      task: async () => {
        await scaffold(allModules, {
          name,
          testing,
          database,
          deployment,
          linter,
          antiSlop: extras.includes("anti-slop"),
          selection,
        });
        return "Scaffolded.";
      },
    });

    if (options.install) {
      taskBuilder.add({
        title: "Installing with pnpm",
        task: async () => {
          await pnpmInstall(name);
          return "Installed.";
        },
      });

      taskBuilder.add({
        title: "Formatting",
        task: async () => {
          await pnpmFormat(name);
          return "Formatted.";
        },
      });
    }

    if (options.git) {
      taskBuilder.add({
        title: "Initializing git",
        task: async () => {
          await initGit(name);
          return "Initialized git.";
        },
      });
    }

    await p.tasks(taskBuilder.tasks);

    p.outro(`Done!`);

    console.log("Next steps:");
    console.log();
    console.log(chalk.blue(`  cd ${name}`));
    if (!options.install) {
      console.log(chalk.blue(`  pnpm install`));
      console.log(chalk.blue(`  pnpm format`));
    }
    console.log(chalk.blue(`  pnpm dev`));
    console.log();

    await reportRun({
      mode: options.nonInteractive ? "flags" : "interactive",
      explicitFlags: options.explicitFlags,
      selection,
    });

    // A DNS lookup that never answers sits on the libuv threadpool, where
    // unref cannot reach it, so an unreachable endpoint would otherwise hold
    // the process open after the user already has their project.
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
}

const program = new Command();

program
  .name("create-newt-app")
  .version(pkg.version)
  .description("Create a new newt-app monorepo")
  .argument("[name]")
  .option("-ni, --no-install", "Skip pnpm install", true)
  .option("-ng, --no-git", "Skip git initialization", true)
  .option("--shadcn", "Include shadcn/ui", false)
  .option("--stylex", "Use StyleX instead of Tailwind", false)
  .option("--testing <framework>", "Testing framework: vitest or jest", "jest")
  .option("--database <database>", "Database: sqlite or postgres", "sqlite")
  .option("--linter <linter>", "Linter: eslint or oxc", "eslint")
  .option("--deployment <strategy>", "Deployment: none, standalone, or spa", "none")
  .option("--nest <mode>", "NestJS: on, off, or di-only", "on")
  .option("--include-example", "Include the todo example", false)
  .option("--extras <list>", "Extras, comma-separated: anti-slop", "")
  .action(
    async (
      name: string,
      options: {
        install: boolean;
        git: boolean;
        shadcn: boolean;
        stylex: boolean;
        testing: string;
        database: string;
        linter: string;
        deployment: string;
        nest: string;
        includeExample: boolean;
        extras: string;
      },
      command: Command,
    ) => {
      intro(`Create a ${chalk.blue("newt")} app.`);

      // Any explicitly passed config flag skips the prompts.
      const CONFIG_FLAGS = {
        shadcn: "--shadcn",
        stylex: "--stylex",
        testing: "--testing",
        database: "--database",
        linter: "--linter",
        deployment: "--deployment",
        nest: "--nest",
        includeExample: "--include-example",
        extras: "--extras",
      } as const;

      const explicitFlags = Object.entries(CONFIG_FLAGS)
        .filter(([option]) => command.getOptionValueSource(option) === "cli")
        .map(([, flag]) => flag);

      const nonInteractive = explicitFlags.length > 0;

      const extras = options.extras
        .split(",")
        .map((extra) => extra.trim())
        .filter(Boolean);

      // Reject typos instead of silently falling back to a default.
      const choices = [
        { flag: "--testing", value: options.testing, allowed: TESTING_CHOICES },
        {
          flag: "--database",
          value: options.database,
          allowed: DATABASE_CHOICES,
        },
        { flag: "--linter", value: options.linter, allowed: LINTER_CHOICES },
        {
          flag: "--deployment",
          value: options.deployment,
          allowed: DEPLOYMENT_CHOICES,
        },
        { flag: "--nest", value: options.nest, allowed: NEST_CHOICES },
        ...extras.map((extra) => ({
          flag: "--extras",
          value: extra,
          allowed: EXTRAS_CHOICES,
        })),
      ];

      const invalid = choices
        .map(({ flag, value, allowed }) => validateFlagValue(flag, value, allowed))
        .find((result) => !result.valid);

      if (invalid) {
        console.error(`Error: ${invalid.error}`);
        process.exit(1);
      }

      // SAFETY: validateFlagValue above rejected any value outside these choice
      // lists and exited, so each string is a member of its union.
      await doInit({
        name,
        install: options.install,
        git: options.git,
        nonInteractive,
        shadcn: options.shadcn,
        stylex: options.stylex,
        testing: options.testing as Testing,
        database: options.database as Database,
        linter: options.linter as Linter,
        deployment: options.deployment as Deployment,
        nest: options.nest as Nest,
        includeExample: options.includeExample,
        extras: extras as Extra[],
        explicitFlags,
      });
    },
  );

program.parse();
