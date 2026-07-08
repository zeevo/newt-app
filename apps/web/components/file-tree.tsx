import React, { Children } from 'react';
import { cn } from '@newt-app/ui/lib/utils';
import { File as FileIcon, Folder as FolderIcon } from 'lucide-react';

export interface FileTreeProps extends React.ComponentProps<'div'> {
  name: string;
}

export interface FileTreeFolderProps extends React.ComponentProps<'div'> {
  name: string;
  annotation?: string;
  children?: React.ReactNode;
  _isLast?: boolean;
}

export interface FileTreeFileProps extends React.ComponentProps<'div'> {
  name: string;
  annotation?: string;
  _isLast?: boolean;
}

function injectIsLast(children: React.ReactNode): React.ReactNode {
  const childArray = Children.toArray(children);
  return childArray.map((child, i) =>
    React.cloneElement(child as React.ReactElement<{ _isLast?: boolean }>, {
      _isLast: i === childArray.length - 1,
    }),
  );
}

function Folder({
  name,
  annotation,
  children,
  _isLast = true,
  className,
  ...props
}: FileTreeFolderProps) {
  return (
    <div data-slot="file-tree-folder" className={cn('relative pl-5', className)} {...props}>
      {/* Vertical line — full height for non-last, half for last */}
      <div className={cn('absolute top-0 left-0 w-px bg-border', _isLast ? 'h-3.5' : 'h-full')} />
      {/* Horizontal connector */}
      <div className="absolute top-3.5 left-0 h-px w-4 bg-border" />
      <div className="flex h-7 items-center gap-2 font-mono text-sm whitespace-nowrap">
        <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="text-foreground">{name}</span>
        {annotation && (
          <span className="font-mono text-xs text-muted-foreground">{annotation}</span>
        )}
      </div>
      {injectIsLast(children)}
    </div>
  );
}

function File({ name, annotation, _isLast = true, className, ...props }: FileTreeFileProps) {
  return (
    <div data-slot="file-tree-file" className={cn('relative pl-5', className)} {...props}>
      <div className={cn('absolute top-0 left-0 w-px bg-border', _isLast ? 'h-3.5' : 'h-full')} />
      <div className="absolute top-3.5 left-0 h-px w-4 bg-border" />
      <div className="flex h-7 items-center gap-2 font-mono text-sm whitespace-nowrap">
        <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="text-foreground">{name}</span>
        {annotation && (
          <span className="font-mono text-xs text-muted-foreground">{annotation}</span>
        )}
      </div>
    </div>
  );
}

function FileTree({ name, className, children, ...props }: FileTreeProps) {
  return (
    <div
      data-slot="file-tree"
      className={cn(
        'my-4 overflow-x-auto rounded-lg bg-accent px-4 py-3.5 dark:bg-zinc-900',
        className,
      )}
      {...props}
    >
      <div className="h-7 font-mono text-sm leading-7 text-foreground">{name}/</div>
      {injectIsLast(children)}
    </div>
  );
}

FileTree.Folder = Folder;
FileTree.File = File;

export { FileTree };
