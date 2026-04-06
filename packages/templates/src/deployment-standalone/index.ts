import type { Module } from "../types";
import webDockerfile from "./templates/web-dockerfile";
import apiDockerfile from "./templates/api-dockerfile";
import dockerCompose from "./templates/docker-compose";

const deploymentStandalone: Module = {
  templates: [webDockerfile, apiDockerfile, dockerCompose],
};

export default deploymentStandalone;
