import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.agentsMd,
  filename: "AGENTS.md",
  template: `Next.js may be newer than your training data. Check \`apps/web/node_modules/next/dist/docs/\` before writing Next.js code.`,
};
