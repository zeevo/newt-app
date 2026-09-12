import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.agentsMd,
  filename: "CLAUDE.md",
  template: `@AGENTS.md`,
};
