

## Two issues to fix

### 1. Restore toolbar position cycle button

The `cyclePosition` function exists in `ToolbarPositionContext` but is never called — the button that let users cycle the toolbar between left/right/top/bottom was removed. 

**Fix**: Add a small cycle button to `PageToolbar.tsx` — a `PanelLeft`/`Columns`-style icon in the toolbar nav that calls `cyclePosition()` on tap. Place it as the first item in every toolbar layout (desktop vertical, desktop horizontal, mobile vertical, mobile horizontal). Show a tooltip with current position. This restores the feature on all pages that use `PageToolbar`.

Files: `src/components/PageToolbar.tsx`

### 2. Make description box background lighter

The scope description textarea in `QuoteTab.tsx` uses `bg-muted/40` which is too dark in the earthy dark theme, making text hard to read.

**Fix**: Change `bg-muted/40` to `bg-muted/20` on the description textarea (line 422) and the block subtotal row (line 439) to lighten them. Add a slightly stronger border (`border-border`) for better field delineation.

Files: `src/components/job/QuoteTab.tsx`

