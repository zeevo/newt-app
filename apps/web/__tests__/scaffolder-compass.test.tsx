import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScaffolderCompass } from "@/components/scaffolder-compass";

const NAMES = [
  "newt-app",
  "RedwoodSDK",
  "Better-T-Stack",
  "create-vite",
  "create-next-app",
  "create-turbo",
  "Nx",
  "next-forge",
  "epic-stack",
  "create-t3-app",
  "create-remix",
  "Blitz",
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

  it("explains the two marker styles", () => {
    render(<ScaffolderCompass />);

    expect(screen.getByText("10 or more commits in 90 days")).toBeInTheDocument();
    expect(screen.getByText("under 5 commits in 90 days")).toBeInTheDocument();
  });

  it("is static, with nothing to hover or focus", () => {
    render(<ScaffolderCompass />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(document.querySelector("[data-slot=tooltip-content]")).toBeNull();
  });
});
