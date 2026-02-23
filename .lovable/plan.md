

## Round the Toolbar and Move Position Toggle to Header

### Changes

**1. Round the vertical toolbar edges** (`src/components/PageToolbar.tsx`)
- On mobile vertical (left/right), add rounded corners to the toolbar: `rounded-r-xl` for left position, `rounded-l-xl` for right position
- Remove the hard border-right/border-left line and replace with a subtle shadow or keep a softer border with the rounded corners
- Ensure the toolbar stretches full height (`min-h-[calc(100vh-6rem)]`) so no square cut-off at bottom

**2. Move the position-cycle toggle (LayoutGrid icon) from the toolbar to the AppHeader** (`src/components/AppHeader.tsx` and `src/components/PageToolbar.tsx`)
- Remove the `toggleBtn` from inside PageToolbar's nav bars (all 4 layout variants)
- Instead, expose the cycle function via a shared mechanism -- simplest approach: move the position state and cycle logic into a small context or keep it in PageToolbar but pass the toggle button up via a render prop / move the LayoutGrid icon into AppHeader
- Cleanest approach: lift position state to a small context (`ToolbarPositionContext`) so AppHeader can render the toggle button and PageToolbar reads the position
- Add the LayoutGrid toggle button to AppHeader's right-side icons, alongside Customers, Settings, Theme, Dark/Light

**3. Desktop vertical toolbar** -- also round the edges for consistency

### Technical Details

**New file: `src/contexts/ToolbarPositionContext.tsx`**
- Stores toolbar position in state + localStorage
- Provides `position`, `cyclePosition` to consumers
- Wraps the app in `App.tsx`

**Modified: `src/components/AppHeader.tsx`**
- Import `useToolbarPosition` context
- Add LayoutGrid button to right-side icons

**Modified: `src/components/PageToolbar.tsx`**
- Remove internal position state -- use context instead
- Remove `toggleBtn` from all nav layouts
- Add rounded corners: mobile left gets `rounded-r-xl`, right gets `rounded-l-xl`
- Desktop vertical similarly rounded

**Modified: `src/App.tsx`**
- Wrap with `ToolbarPositionProvider`

### Files to modify
- New: `src/contexts/ToolbarPositionContext.tsx`
- `src/App.tsx` -- wrap with provider
- `src/components/PageToolbar.tsx` -- use context, remove toggle, add rounded corners
- `src/components/AppHeader.tsx` -- add LayoutGrid toggle button

