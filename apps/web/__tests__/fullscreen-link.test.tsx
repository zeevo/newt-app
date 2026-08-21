import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { InteractiveFileTree } from "@/components/interactive-file-tree";

const renderPanel = (props: { fullscreen?: boolean } = {}) =>
  render(<InteractiveFileTree {...props} />, { wrapper: withNuqsTestingAdapter({}) });

describe("fullscreen link", () => {
  it("points at the builder page", () => {
    renderPanel();

    expect(screen.getByRole("link", { name: /fullscreen/i })).toHaveAttribute("href", "/builder");
  });

  it("is gone once you are on that page", () => {
    renderPanel({ fullscreen: true });

    expect(screen.queryByRole("link", { name: /fullscreen/i })).toBeNull();
  });
});
