import type { Config } from "@/lib/build-command";

// The file tree the homepage renders for a given builder config. `path` is the
// path create-newt-app actually writes, relative to the project root, which is
// what makes this data rather than JSX: __tests__/scaffold-tree.test.ts
// scaffolds real apps and checks that a node is shown exactly when the
// scaffolder emits it.
export type TreeNode = {
  name: string;
  kind: "file" | "dir";
  path: string;
  annotation?: string;
  // Shown for some configs and not others, so it animates in when it appears.
  conditional?: boolean;
  children?: TreeNode[];
};

export function scaffoldTree(c: Config): TreeNode[] {
  return [
    {
      name: "apps",
      kind: "dir",
      path: "apps",
      children: [
        {
          name: "web",
          kind: "dir",
          path: "apps/web",
          annotation: "Next.js frontend",
          children: [
            {
              name: "app",
              kind: "dir",
              path: "apps/web/app",
              children: [
                {
                  name: "layout.tsx",
                  kind: "file",
                  path: "apps/web/app/layout.tsx",
                },
                {
                  name: "page.tsx",
                  kind: "file",
                  path: "apps/web/app/page.tsx",
                  annotation: "home route",
                },
                ...(c.todoExample
                  ? [
                      {
                        name: "todo-list.tsx",
                        kind: "file" as const,
                        path: "apps/web/app/todo-list.tsx",
                        annotation: "todo example",
                        conditional: true,
                      },
                    ]
                  : []),
              ],
            },
            {
              name: "next.config.js",
              kind: "file",
              path: "apps/web/next.config.js",
              annotation:
                c.deployment === "spa"
                  ? "static export"
                  : c.deployment === "standalone"
                    ? "standalone output"
                    : undefined,
            },
          ],
        },
        {
          name: "api",
          kind: "dir",
          path: "apps/api",
          annotation: "NestJS backend",
          children: [
            {
              name: "src",
              kind: "dir",
              path: "apps/api/src",
              children: [
                ...(c.todoExample
                  ? [
                      {
                        name: "todos",
                        kind: "dir" as const,
                        path: "apps/api/src/todos",
                        conditional: true,
                        children: [
                          {
                            name: "todos.service.ts",
                            kind: "file" as const,
                            path: "apps/api/src/todos/todos.service.ts",
                          },
                          ...(c.nestDiOnly
                            ? []
                            : [
                                {
                                  name: "todos.controller.ts",
                                  kind: "file" as const,
                                  path: "apps/api/src/todos/todos.controller.ts",
                                  conditional: true,
                                },
                              ]),
                        ],
                      },
                    ]
                  : []),
                {
                  name: "app.module.ts",
                  kind: "file",
                  path: "apps/api/src/app.module.ts",
                },
                // di-only never bootstraps an HTTP server, so it has no main.ts.
                ...(c.nestDiOnly
                  ? []
                  : [
                      {
                        name: "main.ts",
                        kind: "file" as const,
                        path: "apps/api/src/main.ts",
                        conditional: true,
                      },
                    ]),
                // index.ts re-exports AppModule for the Next.js route handlers
                // that boot Nest from outside apps/api under di-only.
                ...(c.nestDiOnly
                  ? [
                      {
                        name: "index.ts",
                        kind: "file" as const,
                        path: "apps/api/src/index.ts",
                        annotation: "exports the DI context",
                        conditional: true,
                      },
                    ]
                  : []),
              ],
            },
          ],
        },
      ],
    },
    {
      name: "packages",
      kind: "dir",
      path: "packages",
      children: [
        {
          name: "ui",
          kind: "dir",
          path: "packages/ui",
          annotation: c.shadcn ? "shadcn/ui + 63 components" : "minimal UI package",
        },
        {
          name: "auth",
          kind: "dir",
          path: "packages/auth",
          annotation: "Better Auth configuration",
        },
        {
          name: "db",
          kind: "dir",
          path: "packages/db",
          annotation: c.database === "postgres" ? "Kysely + Postgres" : "Kysely + SQLite",
        },
        ...(c.linter === "eslint"
          ? [
              {
                name: "eslint-config",
                kind: "dir" as const,
                path: "packages/eslint-config",
                annotation: "ESLint + Prettier",
                conditional: true,
              },
            ]
          : []),
        {
          name: "typescript-config",
          kind: "dir",
          path: "packages/typescript-config",
          annotation: "Shared TypeScript config",
        },
      ],
    },
    ...(c.changesets
      ? [
          {
            name: ".changeset",
            kind: "dir" as const,
            path: ".changeset",
            conditional: true,
            annotation: "versioning and changelogs",
          },
        ]
      : []),
    ...(c.antiSlop
      ? [
          {
            name: "tools",
            kind: "dir" as const,
            path: "tools",
            conditional: true,
            children: [
              {
                name: "oxlint",
                kind: "dir" as const,
                path: "tools/oxlint",
                children: [
                  {
                    name: "anti-slop",
                    kind: "dir" as const,
                    path: "tools/oxlint/anti-slop",
                    annotation: "vendored oxlint rules",
                  },
                ],
              },
            ],
          },
        ]
      : []),
    // oxc has no config package at all: it configures oxlint and oxfmt from the
    // repo root and packages/eslint-config is simply not scaffolded. eslint puts
    // its rules in that package but still writes .prettierrc at the root, so the
    // two branches are mutually exclusive.
    ...(c.linter === "oxc"
      ? [
          {
            name: ".oxlintrc.json",
            kind: "file" as const,
            path: ".oxlintrc.json",
            annotation: "oxlint",
            conditional: true,
          },
          {
            name: ".oxfmtrc.json",
            kind: "file" as const,
            path: ".oxfmtrc.json",
            annotation: "oxfmt",
            conditional: true,
          },
        ]
      : [
          {
            name: ".prettierrc",
            kind: "file" as const,
            path: ".prettierrc",
            annotation: "prettier",
            conditional: true,
          },
        ]),
  ];
}
