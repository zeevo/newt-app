import type * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FileTreeProps extends React.ComponentProps<'div'> {
  /** Label for the tree root, rendered with a trailing slash. */
  name: string;
}

interface EntryProps extends React.ComponentProps<'li'> {
  name: string;
  /** Muted text shown after the name. */
  annotation?: React.ReactNode;
  /** Replaces the default glyph. An svg child is sized to the 0.875rem slot. */
  icon?: React.ReactNode;
}

export type FileTreeFolderProps = EntryProps;
export type FileTreeFileProps = EntryProps;

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

// The elbow is two absolutely positioned rules. The vertical one runs the full
// height of the entry so it reaches the next sibling, except on the last entry
// where it stops at the elbow, and the DOM answers that with :last-child so no
// entry needs to know its own index.
//
// The height is driven from the entry via a direct-child combinator rather than
// from a `group-last` variant on the span: `group-*` matches descendants, so a
// nested entry would wrongly inherit an ancestor's last-child state.
const ENTRY = [
  'relative pl-5',
  '[&>[data-tree-line]]:h-full',
  '[&:last-child>[data-tree-line]]:h-3.5',
].join(' ');

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
  name,
  annotation,
}: {
  icon: React.ReactNode;
  name: string;
  annotation?: React.ReactNode;
}) {
  return (
    <span className="flex h-7 items-center gap-2 font-mono text-sm whitespace-nowrap">
      <span className="size-3.5 shrink-0 text-muted-foreground [&>svg]:size-full">
        {icon}
      </span>
      <span className="text-foreground">{name}</span>
      {annotation ? (
        <span className="font-mono text-xs text-muted-foreground">{annotation}</span>
      ) : null}
    </span>
  );
}

function Folder({ name, annotation, icon, children, className, ...props }: FileTreeFolderProps) {
  return (
    <li
      data-slot="file-tree-folder"
      className={cn(ENTRY, className)}
      {...props}
    >
      <Connectors />
      <Row icon={icon ?? FolderGlyph} name={name} annotation={annotation} />
      {children ? <ul className="list-none">{children}</ul> : null}
    </li>
  );
}

function File({ name, annotation, icon, className, ...props }: FileTreeFileProps) {
  return (
    <li
      data-slot="file-tree-file"
      className={cn(ENTRY, className)}
      {...props}
    >
      <Connectors />
      <Row icon={icon ?? FileGlyph} name={name} annotation={annotation} />
    </li>
  );
}

function FileTree({ name, className, children, ...props }: FileTreeProps) {
  return (
    <div
      data-slot="file-tree"
      className={cn('my-4 overflow-x-auto rounded-lg bg-accent px-4 py-3.5', className)}
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
