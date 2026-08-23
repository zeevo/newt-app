import type * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FileTreeProps extends React.ComponentProps<"div"> {
  /** Label for the tree root, rendered with a trailing slash. */
  name: string;
}

interface EntryBase extends React.ComponentProps<"li"> {
  /** Muted text shown after the label. */
  annotation?: React.ReactNode;
  /** Replaces the default glyph. An svg child is sized to the 0.875rem slot. */
  icon?: React.ReactNode;
}

export interface FileTreeFolderProps extends EntryBase {
  /** Folder label. A folder spends its children on the entries inside it. */
  name: string;
}

// A file is a leaf, so nothing is competing for its children and the label goes
// there. Required, which `name` could enforce and an optional slot could not.
export interface FileTreeFileProps extends Omit<EntryBase, "children"> {
  children: React.ReactNode;
}

const FolderGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path
      d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FileGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path
      d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm0 0v5h5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Lettering is drawn rather than set in <text>, which would join the row's
// textContent and put "TS" in front of every filename copied out of the tree.
const Stroke = ({ d }: { d: string }) => (
  <path
    d={d}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const S_CURVE =
  "M20.9 9.9c0-1.9-1.4-3-3.1-3s-3.2 1.1-3.2 2.9 1.4 2.4 3.1 2.9 3.2 1.2 3.2 3.1-1.5 3-3.2 3-3.2-1.1-3.2-3";

const TypeScriptGlyph = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <Stroke d="M3.1 6.9h7.8M7 6.9v10.9" />
    <Stroke d={S_CURVE} />
  </svg>
);

const JavaScriptGlyph = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <Stroke d="M10 6.9v8a3 3 0 0 1-5.9.9" />
    <Stroke d={S_CURVE} />
  </svg>
);

const ReactGlyph = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <g fill="none" stroke="currentColor" strokeWidth="1.7">
      <ellipse cx="12" cy="12" rx="10" ry="3.8" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)" />
    </g>
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
  </svg>
);

const JsonGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path
      d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EXTENSION_GLYPHS = new Map([
  ["ts", TypeScriptGlyph],
  ["tsx", ReactGlyph],
  ["js", JavaScriptGlyph],
  ["json", JsonGlyph],
]);

/** The glyph for a filename, for `FileTree.File`'s `icon`. */
export function fileIcon(name: string): React.ReactNode {
  const dot = name.lastIndexOf(".");
  // A leading dot opens a dotfile, not an extension: .prettierrc is not `rc`.
  if (dot < 1) return FileGlyph;
  return EXTENSION_GLYPHS.get(name.slice(dot + 1).toLowerCase()) ?? FileGlyph;
}

// The elbow is two absolutely positioned rules. The vertical one runs the full
// height of the entry so it reaches the next sibling, except on the last entry
// where it stops at the elbow, and the DOM answers that with :last-child so no
// entry needs to know its own index.
//
// The height is driven from the entry via a direct-child combinator rather than
// from a `group-last` variant on the span: `group-*` matches descendants, so a
// nested entry would wrongly inherit an ancestor's last-child state.
const ENTRY = [
  "relative pl-5",
  "[&>[data-tree-line]]:h-full",
  "[&:last-child>[data-tree-line]]:h-3.5",
].join(" ");

function Connectors() {
  return (
    <>
      <span data-tree-line aria-hidden className="absolute top-0 left-0 w-px bg-border" />
      <span aria-hidden className="absolute top-3.5 left-0 h-px w-4 bg-border" />
    </>
  );
}

function Row({
  icon,
  label,
  annotation,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  annotation?: React.ReactNode;
}) {
  return (
    <span className="flex h-7 items-center gap-2 font-mono text-sm whitespace-nowrap">
      <span className="size-3.5 shrink-0 text-muted-foreground [&>svg]:size-full">{icon}</span>
      <span className="text-foreground">{label}</span>
      {annotation ? (
        <span className="font-mono text-xs text-muted-foreground">{annotation}</span>
      ) : null}
    </span>
  );
}

function Folder({ name, annotation, icon, children, className, ...props }: FileTreeFolderProps) {
  return (
    <li data-slot="file-tree-folder" className={cn(ENTRY, className)} {...props}>
      <Connectors />
      <Row icon={icon ?? FolderGlyph} label={name} annotation={annotation} />
      {children ? <ul className="list-none">{children}</ul> : null}
    </li>
  );
}

function File({ children, annotation, icon, className, ...props }: FileTreeFileProps) {
  return (
    <li data-slot="file-tree-file" className={cn(ENTRY, className)} {...props}>
      <Connectors />
      <Row icon={icon ?? FileGlyph} label={children} annotation={annotation} />
    </li>
  );
}

function FileTree({ name, className, children, ...props }: FileTreeProps) {
  return (
    <div
      data-slot="file-tree"
      className={cn("my-4 overflow-x-auto rounded-lg bg-accent px-4 py-3.5", className)}
      {...props}
    >
      <div className="h-7 font-mono text-sm leading-7 text-foreground">{name}/</div>
      <ul className="list-none">{children}</ul>
    </div>
  );
}

FileTree.Folder = Folder;
FileTree.File = File;

export { FileTree };
