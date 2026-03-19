

## Fix: Mobile Job Card Width + Trade-Specific Jobs

### Two Issues

**Issue 1 — Mobile job card content compressed**: On mobile (390px), the left sidebar nav takes 64px (`w-16`), leaving only ~326px for the job card content. The screenshot shows this clearly — buttons and cards are squeezed.

**Fix**: Force the toolbar position to `"top"` on mobile for all modes (not just Work mode). The `PageToolbar` already has a mobile horizontal layout that works well. Currently only Work mode forces top when position is "bottom" — we need to force top for ALL positions on mobile.

**File**: `src/components/PageToolbar.tsx`
- At the top of the component, if `isMobile` is true, override position to `"top"` regardless of stored preference. This prevents the left/right sidebar from ever appearing on mobile.

**Issue 2 — Trade-specific jobs ARE loading correctly**: Network logs confirm the queries return 200 with correct trade-filtered data (verified electrical and glazing both return 10 jobs each). The 80 seed jobs across 8 trades are all in the database. If you're not seeing different jobs, it may be that you need to go through the full flow again (Splash → pick a different trade → pick mode) since each session clears and re-selects.

No code changes needed for issue 2 — the data is there and loading.

### Summary of Changes

| File | Change |
|------|--------|
| `src/components/PageToolbar.tsx` | Force `position = "top"` when `isMobile` is true, preventing sidebar from compressing content on narrow screens |

