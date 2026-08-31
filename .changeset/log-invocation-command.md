---
"create-newt-app": patch
---

record the invocation command in telemetry

Each event now carries the command that produced it, rebuilt from argv rather than echoed: the positional project name becomes `<name>` and an unrecognised token becomes `<flag>`, so a scaffold of `acme-client-portal --shadcn --linter oxc` reports `create-newt-app <name> --shadcn --linter oxc`.

Flags keep their real values, which are enums the CLI has already validated, so flag ordering and the exact spelling people type are both visible without putting free text in a column the server groups by.
