

## Make toolbar position cycler work in Work mode too

### Problem
Line 50 of `AppHeader.tsx` wraps the LayoutGrid button in `{!isWorkMode && ...}`, completely hiding it in Work mode. The user wants it available in both modes.

### Fix

**`src/components/AppHeader.tsx`** — Remove the `!isWorkMode` guard on the LayoutGrid button. When in Work mode, pass `skip={["bottom"]}` to `cyclePosition()` so it cycles left → right → top (skipping bottom which conflicts with WorkBottomNav).

```tsx
// Always show the button, skip "bottom" in work mode
<Button onClick={() => cyclePosition(isWorkMode ? ["bottom"] : undefined)}>
```

### Files changed
1. `src/components/AppHeader.tsx` — show LayoutGrid in all modes, skip "bottom" when `isWorkMode`

