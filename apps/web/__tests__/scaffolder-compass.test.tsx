import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ScaffolderCompass } from "@/components/scaffolder-compass";

const marker = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name},`) });

describe("scaffolder compass", () => {
  it("plots every tool", () => {
    render(<ScaffolderCompass />);

    expect(screen.getAllByRole("button")).toHaveLength(12);
  });

  it("opens on newt-app", () => {
    render(<ScaffolderCompass />);

    expect(screen.getByText("modern · simple")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("swaps the detail panel on hover", () => {
    render(<ScaffolderCompass />);
    fireEvent.mouseEnter(marker("next-forge"));

    expect(screen.getByText("modern · complicated")).toBeInTheDocument();
    expect(screen.getByText("stopped moving")).toBeInTheDocument();
    expect(screen.getByText(/release\.yml/)).toBeInTheDocument();
  });

  it("swaps the detail panel on keyboard focus", () => {
    render(<ScaffolderCompass />);
    fireEvent.focus(marker("create-t3-app"));

    expect(screen.getByText("outdated · simple")).toBeInTheDocument();
    expect(screen.getByText(/28 Pages Router template files/)).toBeInTheDocument();
  });

  it("omits the commit count where there is no figure", () => {
    render(<ScaffolderCompass />);
    fireEvent.mouseEnter(marker("create-remix"));

    expect(screen.queryByText("commits in 90 days")).toBeNull();
  });
});
