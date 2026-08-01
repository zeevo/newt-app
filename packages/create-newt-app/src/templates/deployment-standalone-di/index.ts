import type { Module } from "../types";
import dockerfile from "./templates/dockerfile";
import dockerCompose from "./templates/docker-compose";
import nextConfig from "./templates/next-config";

// Composed after nest-di-only, which otherwise overwrites the standalone
// next.config.js and drops `output: "standalone"`. DI-only also emits no
// apps/api/src/main.ts, so the api image stage and service can't run.
const deploymentStandaloneDi: Module = {
  templates: [dockerfile, dockerCompose, nextConfig],
};

export default deploymentStandaloneDi;
