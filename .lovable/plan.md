

## Problem

On mobile, the entire page scrolls as one unit — the greeting ("G'day Dave"), day strip (MON/TUE/WED...), pickup list, and the time grid all move together. When you scroll down, you lose sight of the heading and day controls. In a native app, these controls stay pinned at the top and only the calendar grid scrolls.

This affects:
- **Work Home** (`/` in Work mode) — greeting, day strip, pickup list disappear on scroll
- **Manager Schedule** (`/schedule`) — day strip, staff filter disappear on scroll

## Root Cause

Both pages render all content in a single scrollable flow. There's no separation between "fixed controls" and "scrollable grid." The `sticky` CSS on the heading bar doesn't help because the day strip and filters are siblings in the same scroll container — they scroll away too.

## Fix: Split into fixed-controls + scrollable-grid layout

### 1. WorkHome (`src/pages/WorkHome.tsx`)

Change the outer layout from a single scrolling `div` to a **flex column that fills the available viewport height**. The top section (greeting, day/week toggle, day strip, pickup list) stays fixed in place. The time grid gets its own scroll container.

```text
┌─────────────────────────┐  ← AppHeader (sticky, 48px)
│  Toolbelt — Work        │
├─────────────────────────┤
│  G'day, Dave 👋  [Day]  │  ← Fixed controls section
│  MON TUE WED THU FRI   │     (shrink-0, no scroll)
│  ← Jump to Today        │
│  📦 Pickup List (2)     │
├─────────────────────────┤
│  7am                    │  ← Scrollable grid
│  8am  ┌────────────┐   │     (flex-1, overflow-y-auto)
│  9am  │ Kitchen... │   │
│  10am └────────────┘   │
│  11am                   │
│  ...                    │
├─────────────────────────┤  ← WorkBottomNav (fixed, 56px)
│  Schedule  +  Timesheet │
└─────────────────────────┘
```

Changes:
- Outer div: replace `space-y-3 pb-24` with `flex flex-col pb-0` and set height to fill viewport minus header (48px) and bottom nav (56px) on mobile: `h-[calc(100dvh-48px-56px)]`
- Top controls section: wrap greeting, day strip, and pickup list in a `shrink-0 px-3 pt-4 space-y-3` div
- Time grid section: wrap in `flex-1 overflow-y-auto px-3 pb-4` div
- On desktop, keep existing behavior (use `sm:` breakpoint to skip the fixed-height layout)

### 2. SchedulePage (`src/pages/SchedulePage.tsx`)

Same pattern. The SchedulePage uses `PageToolbar` which already makes the heading sticky. But the children (day strip, staff filter, grid) all scroll together inside `<main>`.

Changes:
- Wrap the `space-y-3` children div in a flex-column layout
- Day strip + staff filter: `shrink-0`
- Time grid: `flex-1 overflow-y-auto`
- Set a height constraint on the outer container so the grid scrolls independently. Use the PageToolbar's content area height minus the sticky heading.

Since SchedulePage renders inside PageToolbar's `<div className="p-4">{children}</div>`, restructure children:
```
<div className="flex flex-col" style={{ height: 'calc(100dvh - 48px - 44px - 40px)' }}>
  <div className="shrink-0 space-y-3">
    <DayStrip ... />
    <StaffFilterBar ... />
  </div>
  <div className="flex-1 overflow-y-auto mt-3">
    {isMobile ? <TimeGridMobile .../> : <TimeGridDesktop .../>}
  </div>
</div>
```

(The 48px = AppHeader, ~44px = heading bar, ~40px = top toolbar tabs. Exact values may need adjustment.)

### 3. PageToolbar heading — keep existing sticky behavior

The `sticky top-[48px]` on the heading bar is correct and should remain. No changes needed here.

### Files to edit
- `src/pages/WorkHome.tsx` — split into fixed controls + scrollable grid
- `src/pages/SchedulePage.tsx` — same split pattern

### Validation
- Mobile 390x844: Scroll Work home — greeting and day strip stay pinned, only grid scrolls
- Mobile 390x844: Scroll /schedule — day strip and staff filter stay pinned
- Desktop: No change in behavior (full-page scroll as before)
- Week view: Day column headers in TimeGridDesktop remain visible

