# @newt-app/file-tree

A file tree for documenting project structure. Compound components, no state, no
icon dependency, and it renders in a server component.

Not published yet. It lives here to prove the shape before it moves to its own
name on npm.

```tsx
import { FileTree } from "@newt-app/file-tree";

<FileTree name="my-app">
  <FileTree.Folder name="apps">
    <FileTree.Folder name="web" annotation="Next.js frontend">
      <FileTree.File annotation="home route">page.tsx</FileTree.File>
    </FileTree.Folder>
  </FileTree.Folder>
  <FileTree.File annotation="prettier">.prettierrc</FileTree.File>
</FileTree>;
```

## What it needs from you

Tailwind v4 and the shadcn/ui design tokens. The component ships utility classes
rather than its own stylesheet, so it inherits your theme and follows your dark
mode, but it renders unstyled without them. It reads `--color-border`,
`--color-foreground`, `--color-muted-foreground`, and `--color-accent`.

Tailwind only generates classes it can see, and it does not scan `node_modules`
by default, so point it at the package:

```css
@import "tailwindcss";
@source '../node_modules/@newt-app/file-tree/dist/**/*.js';
```

## API

`FileTree` takes a `name` for the root label.

`FileTree.File` takes its label as children. A file is a leaf, so nothing else
wants that slot, and putting the label there makes it required: a file with no
name will not type-check. It also accepts rich labels, which is useful for
highlighting a match or dimming an extension.

`FileTree.Folder` keeps a `name` prop, because its children are the entries
inside it. That asymmetry is deliberate and tracks a real one: branches nest,
leaves do not.

Both take an optional `annotation` rendered in muted text after the label, and
an optional `icon` replacing the default glyph. All three forward the rest of
their props to the underlying element and merge `className` over the defaults
via `tailwind-merge`.

Every part carries a `data-slot` (`file-tree`, `file-tree-folder`,
`file-tree-file`) if you would rather style it from your own CSS.

## How the connectors work

The elbows are two absolutely positioned rules per entry. The vertical one runs
the entry's full height so it meets the next sibling, and stops at the elbow on
the last one. That is decided by `:last-child` in CSS, not by an index passed
down at render time, so children can be a fragment, a mapped array, or a
conditional that returns nothing and the lines stay correct.

The selector uses a direct-child combinator (`&:last-child > [data-tree-line]`)
rather than Tailwind's `group-last`. `group-*` variants match descendants, so a
nested entry would inherit its ancestor's last-child state and draw a short line
in the middle of a list.

## Accessibility

Entries are a nested `ul`/`li`, so structure and depth survive without CSS. It
deliberately does not claim `role="tree"`: that role implies roving-focus
keyboard navigation, which this does not implement, and claiming it would
describe the component inaccurately to a screen reader. This is a static
diagram, and it is marked up as one.
