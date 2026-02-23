

## Fix: Remove Duplicate Home Button

The problem is that the Home icon appears in **two** places:
1. The top **AppHeader** bar (Pipeline, Customers, Settings nav)
2. The movable **PageToolbar** (the sidebar/bar with tab icons)

### Changes

**1. Remove Home button from AppHeader** (`src/components/AppHeader.tsx`)
- Remove the Home/Pipeline button from the header's right-side navigation (lines 37-45)
- The movable toolbar already provides the Home button on every page, so it's redundant in the header

**2. Make Home icon size consistent in PageToolbar** (`src/components/PageToolbar.tsx`)
- Ensure the Home button icon uses `w-5 h-5` to match the other tab icons in the mobile vertical and horizontal layouts
- On desktop, keep `w-4 h-4` to match the desktop tab icon sizes
- Style the Home button similarly to the tab buttons so it looks cohesive (same padding, same size touch target)

### Result
- One Home button, always in the movable toolbar as the first icon
- Consistent icon sizing across all toolbar positions
- No duplicate navigation elements

