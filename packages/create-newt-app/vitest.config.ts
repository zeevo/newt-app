import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Snapshots of scaffolded apps keep their real extensions, so the api specs
    // among them match the default test glob and would be collected and run.
    exclude: [...configDefaults.exclude, "snapshots/**"],
  },
});
