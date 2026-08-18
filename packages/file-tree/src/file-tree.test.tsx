import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileTree } from "./file-tree.js";

const lineOf = (entry: Element) =>
  entry.querySelector(":scope > span[aria-hidden].w-px") as HTMLElement;

const entries = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-slot^="file-tree-"]')] as HTMLElement[];

describe("FileTree", () => {
  it("renders the root name with a trailing slash", () => {
    render(
      <FileTree name="my-app">
        <FileTree.File>README.md</FileTree.File>
      </FileTree>,
    );
    expect(screen.getByText("my-app/")).toBeInTheDocument();
  });

  it("nests entries as a list, so the structure survives without CSS", () => {
    const { container } = render(
      <FileTree name="my-app">
        <FileTree.Folder name="apps">
          <FileTree.File>page.tsx</FileTree.File>
        </FileTree.Folder>
      </FileTree>,
    );
    const folder = container.querySelector('[data-slot="file-tree-folder"]')!;
    expect(folder.tagName).toBe("LI");
    expect(folder.querySelector('ul > [data-slot="file-tree-file"]')).toBeTruthy();
  });

  // The elbow is the reason this component exists: every entry's vertical rule
  // runs full height so it meets the next sibling, and stops short on the last.
  // Assert the selectors that decide it, since asserting the class string alone
  // missed that a `group-last` variant leaks into nested entries.
  it("scopes the short connector to the entry itself, not its descendants", () => {
    const { container } = render(
      <FileTree name="my-app">
        <FileTree.File>first.ts</FileTree.File>
        <FileTree.Folder name="last-folder">
          <FileTree.File>not-last.ts</FileTree.File>
          <FileTree.File>also-last.ts</FileTree.File>
        </FileTree.Folder>
      </FileTree>,
    );

    const shortRule = "[&:last-child>[data-tree-line]]:h-3.5";
    const byName = Object.fromEntries(
      entries(container).map((e) => [e.querySelector("span.flex")!.textContent, e]),
    );

    // every entry carries both rules; :last-child decides which one wins, and a
    // direct-child combinator stops it reaching a nested entry's own line
    Object.values(byName).forEach((e) => {
      expect(e.className).toContain("[&>[data-tree-line]]:h-full");
      expect(e.className).toContain(shortRule);
    });
    expect(shortRule).toContain(">");

    // the nested non-last entry must not be a last child of its own list
    const notLast = byName["not-last.ts"]!;
    expect(notLast.parentElement!.lastElementChild).not.toBe(notLast);
    const alsoLast = byName["also-last.ts"]!;
    expect(alsoLast.parentElement!.lastElementChild).toBe(alsoLast);
  });

  it("applies the same connector rules at every depth", () => {
    const { container } = render(
      <FileTree name="my-app">
        <FileTree.Folder name="apps">
          <FileTree.Folder name="web">
            <FileTree.File>page.tsx</FileTree.File>
          </FileTree.Folder>
        </FileTree.Folder>
      </FileTree>,
    );
    const all = entries(container);
    expect(all).toHaveLength(3);
    all.forEach((entry) => {
      expect(entry.className).toContain("[&:last-child>[data-tree-line]]:h-3.5");
      expect(lineOf(entry)).toBeTruthy();
    });
  });

  it("survives children that are not entries, which cloneElement injection could not", () => {
    const { container } = render(
      <FileTree name="my-app">
        {null}
        {false}
        <>
          <FileTree.File>in-a-fragment.ts</FileTree.File>
        </>
        {["a.ts", "b.ts"].map((n) => (
          <FileTree.File key={n}>{n}</FileTree.File>
        ))}
      </FileTree>,
    );
    expect(entries(container)).toHaveLength(3);
    expect(screen.getByText("in-a-fragment.ts")).toBeInTheDocument();
  });

  it("shows an annotation only when given one", () => {
    const { container } = render(
      <FileTree name="my-app">
        <FileTree.File annotation="standalone output">next.config.js</FileTree.File>
        <FileTree.File>plain.ts</FileTree.File>
      </FileTree>,
    );
    expect(screen.getByText("standalone output")).toBeInTheDocument();
    const plain = entries(container)[1]!;
    expect(plain.textContent).toBe("plain.ts");
  });

  it("takes a replacement icon and keeps the default otherwise", () => {
    const { container } = render(
      <FileTree name="my-app">
        <FileTree.File icon={<span data-testid="mine" />}>custom.ts</FileTree.File>
        <FileTree.File>default.ts</FileTree.File>
      </FileTree>,
    );
    expect(screen.getByTestId("mine")).toBeInTheDocument();
    expect(entries(container)[1]!.querySelector("svg")).toBeTruthy();
  });

  it("merges consumer classes over the defaults instead of duplicating them", () => {
    const { container } = render(<FileTree name="my-app" className="my-0 bg-transparent" />);
    const root = container.querySelector('[data-slot="file-tree"]')!;
    expect(root.className).toContain("my-0");
    expect(root.className).not.toContain("my-4");
    expect(root.className).toContain("bg-transparent");
    expect(root.className).not.toContain("bg-accent");
  });

  // A file's label lives in its children, so the type has to insist on them.
  // If `children` ever goes optional the expect-error below stops being used
  // and tsc fails, which is the point of writing it this way.
  it("will not type-check a file with no label", () => {
    // @ts-expect-error children is the label and is required
    const missingLabel = <FileTree.File />;
    expect(missingLabel).toBeTruthy();
  });

  it("forwards arbitrary props to the underlying element", () => {
    render(<FileTree name="my-app" id="tree" data-x="1" />);
    const root = document.getElementById("tree")!;
    expect(root.getAttribute("data-x")).toBe("1");
  });
});
