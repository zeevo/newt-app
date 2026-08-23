import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ScaffolderCompass } from "@/components/scaffolder-compass";

const marker = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name},`) });

// jsdom cannot produce the real pointer events base-ui opens a tooltip on, so
// these drive the focus path instead. It is the same popup either way.
const reveal = (name: string) => fireEvent.focus(marker(name));

describe("scaffolder compass", () => {
  it("plots every tool", () => {
    render(<ScaffolderCompass />);

    expect(screen.getAllByRole("button")).toHaveLength(12);
  });

  it("names the quadrant on each marker", () => {
    render(<ScaffolderCompass />);

    expect(marker("newt-app")).toHaveAccessibleName("newt-app, modern · simple");
    expect(marker("next-forge")).toHaveAccessibleName("next-forge, modern · complicated");
    expect(marker("create-t3-app")).toHaveAccessibleName("create-t3-app, outdated · simple");
    expect(marker("epic-stack")).toHaveAccessibleName("epic-stack, outdated · complicated");
  });

  it("reveals the evidence in a tooltip", async () => {
    render(<ScaffolderCompass />);
    reveal("next-forge");

    expect(await screen.findByText(/release\.yml/)).toBeInTheDocument();
    expect(screen.getByText(/1 commit in 90 days/)).toBeInTheDocument();
  });

  it("reports tools with no commit figure as no longer developed", async () => {
    render(<ScaffolderCompass />);
    reveal("create-remix");

    expect(await screen.findByText(/no longer developed/)).toBeInTheDocument();
  });

  it("keeps nothing on screen until a marker is reached", () => {
    render(<ScaffolderCompass />);

    expect(screen.queryByText(/release\.yml/)).toBeNull();
    expect(screen.queryByText(/28 Pages Router template files/)).toBeNull();
  });
});
