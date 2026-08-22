import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { InteractiveFileTree } from "@/components/interactive-file-tree";

const renderPanel = (props: { fullscreen?: boolean } = {}, searchParams = "") =>
  render(<InteractiveFileTree {...props} />, { wrapper: withNuqsTestingAdapter({ searchParams }) });

describe("builder link", () => {
  it("points at the builder page", () => {
    renderPanel();

    expect(screen.getByRole("link", { name: "builder" })).toHaveAttribute("href", "/builder");
  });

  it("is gone once you are on that page", () => {
    renderPanel({ fullscreen: true });

    expect(screen.queryByRole("link", { name: "builder" })).toBeNull();
  });

  it("carries the config you picked", () => {
    renderPanel({}, "?linter=eslint&testing=jest");

    const href = screen.getByRole("link", { name: "builder" }).getAttribute("href")!;

    expect(href).toContain("linter=eslint");
    expect(href).toContain("testing=jest");
    // defaults stay out, the same way the panel writes them
    expect(href).not.toContain("shadcn");
  });
});
