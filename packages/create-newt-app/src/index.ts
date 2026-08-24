#!/usr/bin/env node
import { intro } from "@clack/prompts";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
import { Command } from "commander";
import * as p from "@clack/prompts";
import { selectModules, type Extra, type ModuleSelection } from "./templates";
import { hasCommand, initGit, pnpmFormat, pnpmInstall, scaffold } from "./tasks.js";
import {
  checkRequiredTools,
  normalizeProjectName,
  validateDeploymentCombo,
  validateExtrasCombo,
  validateFlagValue,
  validateNodeVersion,
  validateProjectName,
} from "./utils.js";

const TESTING_CHOICES = ["jest", "vitest"] as const;
const DATABASE_CHOICES = ["sqlite", "postgres"] as const;
const LINTER_CHOICES = ["eslint", "oxc"] as const;
const DEPLOYMENT_CHOICES = ["none", "standalone", "spa"] as const;
const EXTRAS_CHOICES = ["anti-slop"] as const satisfies readonly Extra[];

type Testing = (typeof TESTING_CHOICES)[number];
type Database = (typeof DATABASE_CHOICES)[number];
type Linter = (typeof LINTER_CHOICES)[number];
type Deployment = (typeof DEPLOYMENT_CHOICES)[number];

type Answers = {
  name?: string;
  shadcn?: boolean;
  testing?: Testing;
  database?: Database;
  linter?: Linter;
  deployment?: Deployment;
  nestDiOnly?: boolean;
  todoExample?: boolean;
  extras?: Extra[];
};

type Options = {
  name?: string;
  install: boolean;
  git: boolean;
  nonInteractive: boolean;
  shadcn: boolean;
  testing: Testing;
  database: Database;
  linter: Linter;
  deployment: Deployment;
  nestDiOnly: boolean;
  includeExample: boolean;
  extras: readonly Extra[];
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
      testing: () =>
        p.select<Testing>({
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
      nestDiOnly: () =>
        p.confirm({
          message: "Use NestJS for dependency injection only?",
          initialValue: false,
        }),
      todoExample: () =>
        p.confirm({
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
            // DI-only already runs Nest inside the Next process, and SPA's static
            // export can't hold the route handlers DI-only depends on
            ...(results.nestDiOnly
              ? []
              : [
                  {
                    value: "spa" as const,
                    label: "SPA Mode",
                    hint: "static export served by NestJS",
                  },
                ]),
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
    const testing: Testing = options.nonInteractive ? options.testing : (answers.testing ?? "jest");
    const database: Database = options.nonInteractive
      ? options.database
      : (answers.database ?? "sqlite");
    const linter: Linter = options.nonInteractive ? options.linter : (answers.linter ?? "eslint");
    const deployment: Deployment = options.nonInteractive
      ? options.deployment
      : (answers.deployment ?? "none");
    const nestDiOnly = options.nonInteractive ? options.nestDiOnly : (answers.nestDiOnly ?? false);
    const todoExample = options.nonInteractive
      ? options.includeExample
      : (answers.todoExample ?? true);
    const extras: readonly Extra[] = options.nonInteractive
      ? options.extras
      : (answers.extras ?? []);

    const deploymentCombo = validateDeploymentCombo(deployment, nestDiOnly);
    if (!deploymentCombo.valid) {
      throw new Error(deploymentCombo.error);
    }

    const extrasCombo = validateExtrasCombo(extras, linter);
    if (!extrasCombo.valid) {
      throw new Error(extrasCombo.error);
    }

    const selection: ModuleSelection = {
      deployment,
      nestDiOnly,
      todoExample,
      shadcn: useShadcn,
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
    console.log(chalk.blue(`  pnpm dev`));
    console.log();
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
  .option("--testing <framework>", "Testing framework: vitest or jest", "jest")
  .option("--database <database>", "Database: sqlite or postgres", "sqlite")
  .option("--linter <linter>", "Linter: eslint or oxc", "eslint")
  .option("--deployment <strategy>", "Deployment: standalone, spa", "none")
  .option("--nest-di-only", "Use NestJS for dependency injection only", false)
  .option("--include-example", "Include the todo example", false)
  .option("--extras <list>", "Extras, comma-separated: anti-slop", "")
  .action(
    async (
      name: string,
      options: {
        install: boolean;
        git: boolean;
        shadcn: boolean;
        testing: string;
        database: string;
        linter: string;
        deployment: string;
        nestDiOnly: boolean;
        includeExample: boolean;
        extras: string;
      },
      command: Command,
    ) => {
      intro(`Create a ${chalk.blue("newt")} app.`);

      // Any explicitly passed config flag skips the prompts.
      const configFlags = [
        "shadcn",
        "testing",
        "database",
        "linter",
        "deployment",
        "nestDiOnly",
        "includeExample",
        "extras",
      ];
      const nonInteractive = configFlags.some(
        (flag) => command.getOptionValueSource(flag) === "cli",
      );

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
        testing: options.testing as Testing,
        database: options.database as Database,
        linter: options.linter as Linter,
        deployment: options.deployment as Deployment,
        nestDiOnly: options.nestDiOnly,
        includeExample: options.includeExample,
        extras: extras as Extra[],
      });
    },
  );

program.parse();
