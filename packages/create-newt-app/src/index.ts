#!/usr/bin/env node
import { intro } from "@clack/prompts";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
import { Command } from "commander";
import * as p from "@clack/prompts";
import { selectModules, type Mode, type ModuleSelection } from "./templates";
import { hasCommand, initGit, pnpmFormat, pnpmInstall, scaffold } from "./tasks.js";
import {
  checkRequiredTools,
  validateDeploymentCombo,
  validateFlagValue,
  validateModeFlags,
  validateNodeVersion,
} from "./utils.js";

const TESTING_CHOICES = ["jest", "vitest"] as const;
const DATABASE_CHOICES = ["sqlite", "postgres"] as const;
const LINTER_CHOICES = ["eslint", "oxc"] as const;
const DEPLOYMENT_CHOICES = ["none", "standalone", "custom-server", "spa"] as const;

type Testing = (typeof TESTING_CHOICES)[number];
type Database = (typeof DATABASE_CHOICES)[number];
type Linter = (typeof LINTER_CHOICES)[number];
type Deployment = (typeof DEPLOYMENT_CHOICES)[number];

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
  mode: Mode;
  includeExample: boolean;
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
          validate: (value) => {
            if (!value) return "Project name is required";
            if (value.length > 214) return "Project name is too long";
            if (/[<>:"/\\|?*]/.test(value)) return "Project name contains invalid characters";
          },
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
      mode: () =>
        p.select<Mode>({
          message: "How should NestJS run?",
          options: [
            {
              value: "full",
              label: "HTTP server",
              hint: "apps/api on port 3001",
            },
            {
              value: "nest-di-only",
              label: "Dependency injection only",
              hint: "no HTTP server, injected into Next.js",
            },
            {
              value: "bare",
              label: "Not at all",
              hint: "Next.js only, no apps/api",
            },
          ],
          initialValue: "full",
        }),
      includeExample: () =>
        p.confirm({
          message: "Include the example to-do app?",
          initialValue: false,
        }),
      deployment: ({ results }) =>
        p.select<Deployment>({
          message: "Deployment extras?",
          options: [
            { value: "none", label: "None", hint: "skip" },
            // every extra either builds apps/api or is served by it
            ...(results.mode === "bare"
              ? []
              : [
                  {
                    value: "standalone" as const,
                    label: "Standalone + Dockerfile",
                    hint: "Dockerfiles + docker-compose.yml",
                  },
                ]),
            // DI-only already runs Nest inside the Next process, and SPA's static
            // export can't hold the route handlers DI-only depends on
            ...(results.mode === "full"
              ? [
                  {
                    value: "custom-server" as const,
                    label: "Custom Server",
                    hint: "single process, single port",
                  },
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
      await checkRequiredTools({ install: options.install, git: options.git }, hasCommand),
    ].find((result) => !result.valid);

    if (preflight) {
      throw new Error(preflight.error);
    }

    const group = await p.group(groupOpts, {
      onCancel: () => {
        console.log("Exiting.");
        process.exit(0);
      },
    });

    const useShadcn = options.nonInteractive
      ? options.shadcn
      : ((group as { shadcn?: boolean }).shadcn ?? true);
    const testing: Testing = options.nonInteractive
      ? options.testing
      : ((group as { testing?: Testing }).testing ?? "jest");
    const database: Database = options.nonInteractive
      ? options.database
      : ((group as { database?: Database }).database ?? "sqlite");
    const linter: Linter = options.nonInteractive
      ? options.linter
      : ((group as { linter?: Linter }).linter ?? "eslint");
    const deployment: Deployment = options.nonInteractive
      ? options.deployment
      : ((group as { deployment?: Deployment }).deployment ?? "none");
    const mode: Mode = options.nonInteractive
      ? options.mode
      : ((group as { mode?: Mode }).mode ?? "full");
    const includeExample = options.nonInteractive
      ? options.includeExample
      : ((group as { includeExample?: boolean }).includeExample ?? false);

    const deploymentCombo = validateDeploymentCombo(deployment, mode);
    if (!deploymentCombo.valid) {
      throw new Error(deploymentCombo.error);
    }

    const selection: ModuleSelection = {
      deployment,
      mode,
      includeExample,
      shadcn: useShadcn,
      database,
      linter,
      testing,
    };

    const allModules = selectModules(selection);

    const name = (group as { name?: string }).name ?? options.name ?? "";

    const taskBuilder = new TaskBuilder();

    taskBuilder.add({
      title: "Scaffolding project",
      task: async () => {
        await scaffold(allModules, {
          name,
          testing,
          database,
          deployment,
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
  .option("--deployment <strategy>", "Deployment extras: standalone, custom-server, spa", "none")
  .option("--full", "Run NestJS as an HTTP server on port 3001 (default)", false)
  .option("--nest-di-only", "Use NestJS for dependency injection only", false)
  .option("--bare", "Skip NestJS entirely: Next.js only", false)
  .option("--include-example", "Include the example to-do app", false)
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
        full: boolean;
        nestDiOnly: boolean;
        bare: boolean;
        includeExample: boolean;
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
        "full",
        "nestDiOnly",
        "bare",
        "includeExample",
      ];
      const nonInteractive = configFlags.some(
        (flag) => command.getOptionValueSource(flag) === "cli",
      );

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
      ];

      const invalid = choices
        .map(({ flag, value, allowed }) => validateFlagValue(flag, value, allowed))
        .concat(validateModeFlags(options.full, options.nestDiOnly, options.bare))
        .find((result) => !result.valid);

      if (invalid) {
        console.error(`Error: ${invalid.error}`);
        process.exit(1);
      }

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
        mode: options.bare ? "bare" : options.nestDiOnly ? "nest-di-only" : "full",
        includeExample: options.includeExample,
      });
    },
  );

program.parse();
