import type { Module } from "../types";
import webDockerfile from "./templates/web-dockerfile";
import apiDockerfile from "./templates/api-dockerfile";
import dockerCompose from "./templates/docker-compose";
import nextConfig from "./templates/next-config";
import turboJson from "./templates/turbo-json";

const deploymentStandalone: Module = {
  templates: [webDockerfile, apiDockerfile, dockerCompose, nextConfig, turboJson],
};

export default deploymentStandalone;
