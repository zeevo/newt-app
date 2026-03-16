#!/usr/bin/env node
import { intro } from "@clack/prompts";
import chalk from "chalk";
import pkg from "../package.json" with { type: "json" };
import { Command } from "commander";
import * as p from "@clack/prompts";
import { templates } from "@newt-app/templates";
import { initGit, pnpmFormat, pnpmInstall, scaffold } from "./tasks.js";

type Options = {
  name?: string;
  install: boolean;
  git: boolean;
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
  };

  try {
    const group = await p.group(groupOpts, {
      onCancel: () => {
        console.log("Exiting.");
        process.exit(0);
      },
    });

    const allModules = [
      templates.root,
      templates.web,
      templates.api,
      templates.auth,
      templates.ui,
      templates.eslintConfig,
      templates.typescriptConfig,
    ];

    const name = (group as { name?: string }).name ?? options.name ?? "";

    const taskBuilder = new TaskBuilder();

    taskBuilder.add({
      title: "Scaffolding project",
      task: async () => {
        try {
          await scaffold(allModules, { name });
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
    console.log(chalk.blue(`  cp .env.example .env`));
    console.log(chalk.blue(`  # fill in DATABASE_URL`));
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
  .action(
    async (
      name: string,
      options: {
        install: boolean;
        git: boolean;
      }
    ) => {
      console.log("\n");

      intro(`Create a ${chalk.blue("newt")} app.`);

      await doInit({
        name,
        install: options.install,
        git: options.git,
      });
    }
  );

program.parse();
