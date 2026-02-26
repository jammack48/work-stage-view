

## Three Changes

### 1. Make the left toolbar nav sticky (PageToolbar.tsx)

**Mobile vertical nav (lines 108-137)**: Change the `<nav>` from using `minHeight` to `position: sticky; top: 0; self-start` so it stays pinned while the content scrolls.

- Line 110-114: Change nav classes to add `sticky top-0` and use `h-screen` or `max-h-screen overflow-y-auto` instead of the `minHeight` style, and add `self-start` to the flex container.

### 2. Remove sticky from Manager Mode filters (ManagerMode.tsx)

**Line 361**: Change `"sticky top-0 z-10 bg-background pb-2 flex flex-col gap-3 pt-1"` to just `"flex flex-col gap-3 pt-1"` — removing the sticky positioning from the stage picker + priority filters.

### 3. Hide Pipeline Dashboard heading when in Manager Mode (Index.tsx)

**Line 73**: Change `pageHeading={` to `pageHeading={activeView === "manager" ? undefined :` and close with `)` after the existing closing `}` on line 124, so the heading bar is hidden entirely in Manager Mode.

