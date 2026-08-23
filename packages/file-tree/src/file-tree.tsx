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

// Brand marks for the extensions a scaffolded project is mostly made of. The
// icon slot tints its child with currentColor, so each mark that carries brand
// color sets its own fill and opts out of the tint.
//
// The lettering is drawn rather than set in <text>: an svg text node joins the
// row's textContent, which would put "TS" in front of every filename copied out
// of the tree, and it would also leave the shape at the mercy of a font.
const Lettering = ({ d, color }: { d: string; color: string }) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const S_CURVE =
  "M19.6 11.1c0-1.2-1.2-1.9-2.7-1.9s-2.8.7-2.8 2 1.3 1.7 2.7 2 2.8.8 2.8 2.1-1.3 2-2.8 2-2.8-.8-2.8-2";

const TypeScriptGlyph = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <rect width="24" height="24" rx="3" fill="#3178C6" />
    <Lettering color="#FFFFFF" d="M3.6 9.4h7M7.1 9.4v8.2" />
    <Lettering color="#FFFFFF" d={S_CURVE} />
  </svg>
);

const JavaScriptGlyph = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <rect width="24" height="24" rx="3" fill="#F7DF1E" />
    <Lettering color="#000000" d="M9 9.4v5.9a2.3 2.3 0 0 1-4.5.8" />
    <Lettering color="#000000" d={S_CURVE} />
  </svg>
);

// .tsx is a React component, and the atom reads at this size where a third
// letter on the TypeScript square would not.
const ReactGlyph = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <g fill="none" stroke="#61DAFB" strokeWidth="1.9">
      <ellipse cx="12" cy="12" rx="10" ry="3.6" />
      <ellipse cx="12" cy="12" rx="10" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.6" transform="rotate(120 12 12)" />
    </g>
    <circle cx="12" cy="12" r="2.1" fill="#61DAFB" />
  </svg>
);

// JSON has no brand mark, so braces carry it. Left on currentColor so the many
// package.json and tsconfig.json entries stay as quiet as the plain sheet.
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

/**
 * The glyph for a filename, or the plain sheet when the extension has none.
 * Pass it to `FileTree.File`'s `icon`, which is left alone by default so a
 * consumer chooses whether the tree is typed or uniform.
 */
export function fileIcon(name: string): React.ReactNode {
  const dot = name.lastIndexOf(".");
  // A leading dot opens a dotfile, not an extension: .prettierrc is not `rc`,
  // while .oxlintrc.json still resolves on its second dot.
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
