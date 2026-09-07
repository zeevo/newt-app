import type { Module } from "../types";
import dockerfile from "./templates/dockerfile";
import dockerCompose from "./templates/docker-compose";
import nextConfig from "./templates/next-config";

// The standalone deployment for the two modes with no api container: di-only
// runs Nest inside the Next.js process and off has no Nest at all. Composed
// after nest-di-only and nest-off, which otherwise overwrite the standalone
// next.config.js and drop `output: "standalone"`.
const deploymentStandaloneWeb: Module = {
  templates: [dockerfile, dockerCompose, nextConfig],
};

export default deploymentStandaloneWeb;
