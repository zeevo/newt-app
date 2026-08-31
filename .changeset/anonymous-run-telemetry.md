---
"create-newt-app": patch
---

send one anonymous event per completed scaffold: the options chosen, the CLI and Node major versions, the platform, whether the run was driven by prompts or flags, and whether it was in CI. No project name, path, file contents or identifier of any kind, and the server does not store the client IP.

Cancelled runs and failed scaffolds send nothing. Opt out with `DO_NOT_TRACK=1` or `NEWT_TELEMETRY_DISABLED=1`.

The endpoint is inlined at build time and is empty in every build except an official release, so local builds, contributor test runs and this repo's own scaffold matrix cannot report anything.
