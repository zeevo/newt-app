import type { Module } from "../types";
import { versions } from "../versions";
import config from "./templates/config";
import readme from "./templates/readme";

const root = "";

const changesets: Module = {
  templates: [config, readme],
  packages: [
    {
      package: "@changesets/cli",
      module: root,
      version: versions["@changesets/cli"],
      dev: true,
    },
  ],
  scripts: [
    { module: root, name: "changeset", script: "changeset" },
    { module: root, name: "version-packages", script: "changeset version" },
    { module: root, name: "release", script: "turbo run build && changeset publish" },
  ],
};

export default changesets;
