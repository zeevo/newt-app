import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScaffolderCompass } from "@/components/scaffolder-compass";

const NAMES = [
  "newt-app",
  "Better-T-Stack",
  "create-vite",
  "create-next-app",
  "create-turbo",
  "next-forge",
  "epic-stack",
  "create-t3-app",
  "create-remix",
];

describe("scaffolder compass", () => {
  it("describes the plot for screen readers", () => {
    render(<ScaffolderCompass />);

    expect(screen.getByRole("img", { name: /modern and simple quadrant/i })).toBeInTheDocument();
  });

  it("labels every tool", () => {
    render(<ScaffolderCompass />);

    NAMES.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument());
  });

  it("labels both axes at each end", () => {
    render(<ScaffolderCompass />);

    ["MODERN", "OUTDATED", "SIMPLE", "COMPLICATED"].forEach((cap) =>
      expect(screen.getByText(cap)).toBeInTheDocument(),
    );
  });

  it("plots position only, with no maintenance labelling", () => {
    render(<ScaffolderCompass />);

    expect(screen.queryByText(/commits in 90 days/)).toBeNull();
  });

  it("is static, with nothing to hover or focus", () => {
    render(<ScaffolderCompass />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(document.querySelector("[data-slot=tooltip-content]")).toBeNull();
  });
});
