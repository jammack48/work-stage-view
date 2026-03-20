

## Fix: Restore Full 4-Position Toolbar Cycling on Mobile

### Problem

Line 38-39 restricts mobile to only `top` and `bottom` by forcing `left`/`right` → `top`. This breaks the core feature where the toolbar cycles through all 4 positions (top → left → bottom → right).

The mobile layout already has proper rendering for left/right sidebars (lines 176-215), so there's no reason to block those positions.

### Fix

**File**: `src/components/PageToolbar.tsx` (line 38-40)

Remove the mobile position override entirely. Let `rawPosition` pass through on mobile just like desktop:

```typescript
const position = isWorkMode && rawPosition === "bottom" ? "top" : rawPosition;
```

This single line keeps the only necessary override (Work mode skips bottom on desktop due to the persistent bottom nav) and restores full top → left → bottom → right cycling on mobile for all modes including Manager.

### One file, one line change.

