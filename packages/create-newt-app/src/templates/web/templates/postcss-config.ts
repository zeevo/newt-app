import type { Selection } from "../../types";
export default {
  when: (s: Selection) => !s.stylex,
  filename: "apps/web/postcss.config.mjs",
  template: `export { default } from "@<%= projectName %>/ui/postcss.config";`,
};
