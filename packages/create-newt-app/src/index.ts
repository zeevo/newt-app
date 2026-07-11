#!/usr/bin/env node
import { intro } from "@clack/prompts";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
import { Command } from "commander";
import * as p from "@clack/prompts";
import { templates } from "@newt-app/templates";
import { initGit, pnpmFormat, pnpmInstall, scaffold } from "./tasks.js";

type Testing = 'jest' | 'vitest';
type Database = 'sqlite' | 'postgres';
type Deployment = 'none' | 'standalone' | 'custom-server' | 'spa';

type Options = {
  name?: string;
  install: boolean;
  git: boolean;
  ci: boolean;
  shadcn: boolean;
  testing: Testing;
  database: Database;
  deployment: Deployment;
  nestDiOnly: boolean;
  bare: boolean;
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
    ...(!options.ci && {
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
      deployment: () =>
        p.select<Deployment>({
          message: "Deployment extras?",
          options: [
            { value: "none", label: "None", hint: "skip" },
            { value: "standalone", label: "Standalone + Dockerfile", hint: "Dockerfiles + docker-compose.yml" },
            { value: "custom-server", label: "Custom Server", hint: "single process, single port" },
            { value: "spa", label: "SPA Mode", hint: "static export served by NestJS" },
          ],
          initialValue: "none",
        }),
    }),
  };

  try {
    const group = await p.group(groupOpts, {
      onCancel: () => {
        console.log("Exiting.");
        process.exit(0);
      },
    });

    const useShadcn = options.ci ? options.shadcn : (group as { shadcn?: boolean }).shadcn ?? true;
    const testing: Testing = options.ci ? options.testing : (group as { testing?: Testing }).testing ?? 'jest';
    const database: Database = options.ci ? options.database : (group as { database?: Database }).database ?? 'sqlite';
    const deployment: Deployment = options.ci ? options.deployment : (group as { deployment?: Deployment }).deployment ?? 'none';
    const nestDiOnly = options.ci ? options.nestDiOnly : (group as { nestDiOnly?: boolean }).nestDiOnly ?? false;
    const todoExample = options.ci ? !options.bare : (group as { todoExample?: boolean }).todoExample ?? true;

    const deploymentModule =
      deployment === 'standalone' ? templates.deploymentStandalone :
      deployment === 'custom-server' ? templates.deploymentCustomServer :
      deployment === 'spa' ? templates.deploymentSpa :
      null;

    const allModules = [
      templates.root,
      templates.web,
      templates.api,
      database === 'postgres' ? templates.dbPostgres : templates.dbSqlite,
      templates.auth,
      useShadcn ? templates.shadcnUi : templates.ui,
      templates.eslintConfig,
      templates.typescriptConfig,
      testing === 'vitest' ? templates.testingVitest : templates.testingJest,
      ...(deploymentModule ? [deploymentModule] : []),
      ...(nestDiOnly ? [templates.nestDiOnly] : [templates.apiControllers]),
      ...(todoExample
        ? [
            templates.todoExampleApi,
            ...(nestDiOnly ? [templates.todoExampleDi] : [templates.todoExampleControllers]),
            useShadcn ? templates.todoExampleShadcn : templates.todoExampleWeb,
          ]
        : []),
    ];

    const name = (group as { name?: string }).name ?? options.name ?? "";

    const taskBuilder = new TaskBuilder();

    taskBuilder.add({
      title: "Scaffolding project",
      task: async () => {
        try {
          await scaffold(allModules, { name, testing, database });
        } catch (e) {
          console.log(e);
        }
        return "Scaffolded.";
      },
    });

    if (options.install) {
      taskBuilder.add({
        title: "Installing with pnpm",
        task: async () => {
          try {
            await pnpmInstall(name);
          } catch (e) {
            console.log(e);
          }
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
    console.log(chalk.blue(`  pnpm db:migrate`));
    console.log(chalk.blue(`  pnpm dev`));
    console.log();
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
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
  .option("--ci", "Non-interactive mode", false)
  .option("--shadcn", "Include shadcn/ui (used with --ci)", false)
  .option("--testing <framework>", "Testing framework: vitest or jest (used with --ci)", "jest")
  .option("--database <database>", "Database: sqlite or postgres (used with --ci)", "sqlite")
  .option("--deployment <strategy>", "Deployment extras: standalone, custom-server, spa (used with --ci)", "none")
  .option("--nest-di-only", "Use NestJS for dependency injection only (used with --ci)", false)
  .option("--bare", "Skip the todo example (used with --ci)", false)
  .action(
    async (
      name: string,
      options: {
        install: boolean;
        git: boolean;
        ci: boolean;
        shadcn: boolean;
        testing: string;
        database: string;
        deployment: string;
        nestDiOnly: boolean;
        bare: boolean;
      }
    ) => {
      intro(`Create a ${chalk.blue("newt")} app.`);

      await doInit({
        name,
        install: options.install,
        git: options.git,
        ci: options.ci,
        shadcn: options.shadcn,
        testing: (options.testing === 'vitest' ? 'vitest' : 'jest') as Testing,
        database: (options.database === 'postgres' ? 'postgres' : 'sqlite') as Database,
        deployment: (['standalone', 'custom-server', 'spa'].includes(options.deployment)
          ? options.deployment
          : 'none') as Deployment,
        nestDiOnly: options.nestDiOnly,
        bare: options.bare,
      });
    }
  );

program.parse();
