

## Fix Week View Clutter + Toolbar Position Issues

### Issue 1: Week view too busy on mobile — show 3 days at a time

The 7-column week grid is unreadable on a ~384px mobile screen (each column ~40px). Instead of cramming 7 days, show a **3-day sliding window** centered on the selected day.

**Changes in `src/pages/WorkHome.tsx`:**
- When `viewMode === "week"` on mobile, render a new `TimeGrid3Day` component (or pass a `visibleDays={3}` prop to `TimeGridDesktop`) showing only 3 consecutive days around `selectedDay`.
- Swiping left/right shifts the 3-day window forward/back, wrapping weeks as needed.

**Changes in `src/components/schedule/TimeGridDesktop.tsx`:**
- Add an optional `visibleDays` prop (default 7). When set to 3, only render 3 day columns starting from a `startDayOffset` prop.
- Grid template becomes `grid-cols-[60px_repeat(3,1fr)]` when `visibleDays=3`, giving each column ~100px — plenty of room for readable job cards.
- Day headers adjust to show only the visible days.

**Changes in `src/pages/SchedulePage.tsx`:**
- Same treatment for the manager schedule on mobile: pass `visibleDays={3}` and `startDayOffset={selectedDay}` when `isMobile`.

### Issue 2: Toolbar layout icon doesn't work properly

The 4-square `LayoutGrid` button in `AppHeader` calls `cyclePosition()` which cycles through left → bottom → right → top. Two problems:

1. **Work mode forces `bottom` → `top`** (line 36 of PageToolbar), so cycling to "bottom" in Work mode silently shows "top" — confusing.
2. **Schedule/WorkHome pages don't use PageToolbar** — WorkHome has no PageToolbar wrapper at all, so changing position has no visible effect and may cause layout glitches.

**Fix in `src/contexts/ToolbarPositionContext.tsx`:**
- No changes needed to the context itself.

**Fix in `src/components/AppHeader.tsx`:**
- When in Work mode, skip "bottom" in the cycle (since it's forced to "top" anyway). Cycle: left → right → top → left.
- This prevents the confusing state where the user presses the button and nothing visibly changes.

**Fix in `src/components/PageToolbar.tsx`:**
- When position is "left" or "right" on mobile, the sidebar overlaps content. The schedule page content gets pushed but the time grid may overflow. Add `overflow-x-hidden` to the main content area in the vertical mobile layout (line 205).

### Files changed
1. `src/components/schedule/TimeGridDesktop.tsx` — add `visibleDays` + `startDayOffset` props, adjust grid template
2. `src/pages/WorkHome.tsx` — pass `visibleDays={3}` and computed `startDayOffset` on mobile week view
3. `src/pages/SchedulePage.tsx` — same 3-day mobile treatment
4. `src/components/AppHeader.tsx` — skip "bottom" position in Work mode cycle
5. `src/components/PageToolbar.tsx` — overflow fix for vertical mobile layouts

