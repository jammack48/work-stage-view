

## Plan: Layout button in Work Mode, Timesheet on bottom nav, floating New Job button

### Changes

#### 1. `src/components/AppHeader.tsx` — Re-enable layout button for Work Mode
- Remove the `{!isWorkMode && ...}` wrapper around the LayoutGrid tooltip/button (lines 50-64) so it shows in both modes.

#### 2. `src/components/WorkBottomNav.tsx` — Replace New Job with Timesheet
- Replace the "add" (New Job) center FAB item with a Timesheet item: `{ id: "time", icon: Clock, label: "Timesheet", path: "/timesheet" }`
- Remove the special FAB styling for the center item (the raised circle)
- Nav becomes: Schedule | Notes | Timesheet | Chat | Hub

#### 3. `src/pages/WorkHome.tsx` — Add floating "New Job" button
- Add a fixed-position floating action button (bottom-right, above the bottom nav) with a `+` icon that navigates to `/new-job`
- Styled as a 56px circular primary button with shadow, positioned `bottom-20 right-4`

#### 4. `src/pages/WorkHub.tsx` — Remove Timesheet tab
- Remove the "Time" tab from Hub since it's back on the bottom nav
- Revert TabsList to `grid-cols-4`

### Technical notes
- The layout cycle button works globally via `ToolbarPositionContext` — it just needs to be visible. Work Mode pages don't use `PageToolbar` currently, but showing the button is harmless and future-ready.
- The floating button only appears on Work Mode schedule page to avoid clutter on other pages.

