import type { Module } from "../types";
import webNextConfig from "./templates/web-next-config";
import webHelloRoute from "./templates/web-hello-route";

// No apps/api at all: Next.js serves its own /api routes, and the shared
// packages (auth, db, ui) are consumed directly.
const bare: Module = {
  templates: [webNextConfig, webHelloRoute],
};

export default bare;
