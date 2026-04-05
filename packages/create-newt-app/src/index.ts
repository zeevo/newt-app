#!/usr/bin/env node
import { intro } from "@clack/prompts";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
import { Command } from "commander";
import * as p from "@clack/prompts";
import { templates } from "@newt-app/templates";
import { initGit, pnpmFormat, pnpmInstall, scaffold } from "./tasks.js";

type Testing = 'jest' | 'vitest';

type Options = {
  name?: string;
  install: boolean;
  git: boolean;
  ci: boolean;
  shadcn: boolean;
  testing: Testing;
  singleProcess: boolean;
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
      singleProcess: () =>
        p.confirm({
          message: "Single-process mode? (NestJS runs inside Next.js via pages/api catch-all)",
          initialValue: false,
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
    const useSingleProcess = options.ci ? options.singleProcess : (group as { singleProcess?: boolean }).singleProcess ?? false;

    const allModules = [
      templates.root,
      templates.web,
      templates.api,
      templates.auth,
      useShadcn ? templates.shadcnUi : templates.ui,
      templates.eslintConfig,
      templates.typescriptConfig,
      testing === 'vitest' ? templates.testingVitest : templates.testingJest,
      ...(useSingleProcess ? [templates.singleProcessPages] : []),
    ];

    const name = (group as { name?: string }).name ?? options.name ?? "";

    const taskBuilder = new TaskBuilder();

    taskBuilder.add({
      title: "Scaffolding project",
      task: async () => {
        try {
          await scaffold(allModules, { name, testing });
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
    console.log(chalk.blue(`  # fill in DATABASE_URL in .env`));
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
  .option("--single-process", "Single-process mode: NestJS runs inside Next.js via pages/api catch-all (used with --ci)", false)
  .action(
    async (
      name: string,
      options: {
        install: boolean;
        git: boolean;
        ci: boolean;
        shadcn: boolean;
        testing: string;
        singleProcess: boolean;
      }
    ) => {
      console.log("\n");

      intro(`Create a ${chalk.blue("newt")} app.`);

      await doInit({
        name,
        install: options.install,
        git: options.git,
        ci: options.ci,
        shadcn: options.shadcn,
        testing: (options.testing === 'jest' ? 'jest' : 'vitest') as Testing,
        singleProcess: options.singleProcess,
      });
    }
  );

program.parse();
