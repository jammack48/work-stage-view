

## Plan: Unify Schedule Layout + Add 1/3/5-Day View Toggle + Include Weekends

### Build error fix
**`supabase/functions/ai-suggest-description/index.ts`** line 70: Change `e.message` to `(e as Error).message` to fix the TS18046 error.

### 1. Unify TimesheetHome to use the same schedule layout

**`src/pages/TimesheetHome.tsx`** — Currently shows a flat list of jobs. Rebuild it to match WorkHome layout:
- Add DayStrip, TimeGrid3Day, week navigation, greeting header
- Filter jobs to current staff only (same as WorkHome)
- No materials pickup, no FAB button (timesheet-only mode)

### 2. Add 1/3/5-Day view toggle to all three schedule pages

Create a small toggle component (3 buttons: "1", "3", "5") that controls how many day columns show in the time grid. Store selection in local state per page.

**New: `src/components/schedule/DayViewToggle.tsx`**
- Simple row of 3 buttons: 1 Day, 3 Days, 5 Days
- Props: `value: 1|3|5`, `onChange: (v) => void`

### 3. Update TimeGrid3Day to support 1/3/5 day views

**`src/components/schedule/TimeGrid3Day.tsx`** — Already accepts `dates` array, so pass 1, 3, or 5 dates. No major changes needed, just ensure it works with 1 date (full width single column).

### 4. Update swipe behavior

When swiping, advance by the number of visible days (1, 3, or 5) instead of jumping whole weeks.

**`src/pages/WorkHome.tsx`**:
- Add `viewDays` state (1/3/5, default 3)
- Add DayViewToggle component
- Compute `dates` array as a sliding window of `viewDays` days starting from `selectedDate` (not locked to week boundaries)
- Swipe advances/retreats by `viewDays` days
- Include weekends — no more skipping Sat/Sun

**`src/pages/SchedulePage.tsx`**:
- Add same `viewDays` state + DayViewToggle
- On mobile: use TimeGrid3Day with the viewDays count instead of TimeGridMobile (single day)
- On desktop: pass `visibleDays` to TimeGridDesktop
- Swipe/nav moves by `viewDays` days
- Include weekends

**`src/pages/TimesheetHome.tsx`**:
- Same pattern as WorkHome but simplified (no materials, no FAB)

### 5. Include weekends everywhere

- DayStrip already shows 7 days (Mon-Sun) — no change needed
- The date windows for 1/3/5 views move freely across week boundaries (already handled by TimeGrid3Day's cross-week logic)
- Remove the `[0,1,2,3,4]` (Mon-Fri only) pattern in WorkHome, replace with dynamic window
- Week header text shows full range including weekends

### Files changed
1. `supabase/functions/ai-suggest-description/index.ts` — fix build error
2. `src/components/schedule/DayViewToggle.tsx` — new component
3. `src/pages/WorkHome.tsx` — add view toggle, dynamic date window, weekend support
4. `src/pages/SchedulePage.tsx` — add view toggle, unify mobile/desktop
5. `src/pages/TimesheetHome.tsx` — rebuild with proper schedule grid

