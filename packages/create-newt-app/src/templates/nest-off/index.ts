import type { Module } from "../types";
import webNextConfig from "./templates/web-next-config";
import webHelloRoute from "./templates/web-hello-route";

// Everything apps/api used to supply, written straight into apps/web: the
// /api/hello handler and a next.config with nothing to proxy to.
const nestOff: Module = {
  templates: [webNextConfig, webHelloRoute],
};

export default nestOff;
