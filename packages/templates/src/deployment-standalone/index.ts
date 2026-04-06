import type { Module } from "../types";
import dockerfile from "./templates/dockerfile";
import dockerCompose from "./templates/docker-compose";
import nextConfig from "./templates/next-config";
import turboJson from "./templates/turbo-json";

const deploymentStandalone: Module = {
  templates: [dockerfile, dockerCompose, nextConfig, turboJson],
};

export default deploymentStandalone;
