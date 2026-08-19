import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { InteractiveFileTree } from "@/components/interactive-file-tree";

// The panel's other tests all run against lib/, which typechecks clean even
// when the markup throws: a menu label outside its group crashed Base UI at
// open time and nothing but a browser caught it. This renders the real thing.
const renderPanel = (searchParams = "") =>
  render(<InteractiveFileTree />, { wrapper: withNuqsTestingAdapter({ searchParams }) });

const openExtras = () => {
  fireEvent.click(screen.getByRole("button", { name: /example app|none|anti-slop/ }));
  return screen.getByRole("menu");
};

const command = () => screen.getByText(/npm create newt-app/).textContent ?? "";

describe("extras menu", () => {
  it("opens with deployment and the extras in one menu", () => {
    renderPanel();
    const menu = openExtras();

    expect(within(menu).getByRole("menuitemradio", { name: "none" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitemradio", { name: "spa" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitemcheckbox", { name: "example app" })).toBeChecked();
    expect(within(menu).getByRole("menuitemcheckbox", { name: "anti-slop" })).not.toBeChecked();
  });

  it("adds --extras anti-slop when anti-slop is ticked", () => {
    renderPanel();
    fireEvent.click(within(openExtras()).getByRole("menuitemcheckbox", { name: "anti-slop" }));

    expect(command()).toContain("--extras anti-slop");
  });

  it("does not offer anti-slop under eslint", () => {
    renderPanel("?linter=eslint");
    const menu = openExtras();

    expect(within(menu).getByRole("menuitemcheckbox", { name: "example app" })).toBeInTheDocument();
    expect(within(menu).queryByRole("menuitemcheckbox", { name: "anti-slop" })).toBeNull();
  });
});
