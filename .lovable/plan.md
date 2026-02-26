

## Feature: Schedule Tab on Pipeline Toolbar

### Overview
Add a "Schedule" tab to the Pipeline toolbar that opens a new `/schedule` page. The page shows a weekly calendar view with demo jobs assigned to staff members, with two layout options the user can toggle between.

### 1. Pipeline Toolbar — `src/pages/Index.tsx`
- Add `CalendarDays` icon import from lucide-react
- Add `{ id: "schedule", label: "Schedule", icon: CalendarDays }` to `HOME_TABS` (after Bundles, before Customers)
- Add handler: `if (id === "schedule") { navigate("/schedule"); return; }`

### 2. Route — `src/App.tsx`
- Import `SchedulePage` and add `<Route path="/schedule" element={<SchedulePage />} />`

### 3. Schedule Page — `src/pages/SchedulePage.tsx` (new)

Uses `PageToolbar` with its own tab set (Pipeline, Bundles, Schedule, Customers, etc — same as Index).

**Demo data (inline):**
- 4–5 staff members: e.g. "Dave", "Mike", "Tama", "Lisa", "Hemi"
- 8–10 demo jobs spread across Mon–Fri of the current week, each assigned to a staff member with a time block, job name, and client name
- Jobs pulled from existing `dummyJobs` data where possible, supplemented with schedule-specific fields (day, startHour, durationHours, assignedTo)

**Page heading bar:** "Weekly Schedule" with current week range (e.g. "24 Feb – 28 Feb") and prev/next week buttons

**Two view modes (toggle in heading bar):**

**View A — Staff Rows (default):**
```text
         Mon 24    Tue 25    Wed 26    Thu 27    Fri 28
Dave   | [Kitchen] |         | [Deck]  |         |
Mike   |           | [Roof]  |         | [Fence] |
Tama   | [Bath]    | [Bath]  |         |         | [Paint]
Lisa   |           |         | [Tiles] | [Tiles] |
```
- Staff names in a fixed left column
- Days across the top as column headers
- Job cards sit in the grid cells — showing job name, client, time range
- On mobile: horizontally scrollable with sticky staff column

**View B — Day Columns:**
```text
  Mon 24         Tue 25         Wed 26
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Dave        │ │ Mike        │ │ Dave        │
│ Kitchen Reno│ │ Roof Repair │ │ Deck Build  │
│ 8am-3pm    │ │ 9am-4pm    │ │ 7am-2pm    │
├────────────┤ ├────────────┤ ├────────────┤
│ Tama        │ │ Tama        │ │ Lisa        │
│ Bathroom    │ │ Bathroom    │ │ Tiling      │
│ 8am-5pm    │ │ 8am-5pm    │ │ 10am-4pm   │
└────────────┘ └────────────┘ └────────────┘
```
- Each day is a column with stacked job cards
- Cards show staff name, job name, client, time
- On mobile: Embla carousel swiping one day at a time (same pattern as pipeline mobile view)

**Job cards:** Compact rounded cards with subtle left-border colour per staff member. Clicking a job card navigates to `/job/:id`.

**Mobile adaptations:**
- View A: Staff column sticky, days scroll horizontally, cards smaller
- View B: Single-day swipeable carousel with dot indicators and prev/next arrows (reusing the existing Embla pattern from Index.tsx)
- Toggle between View A and View B via the same button group pattern used for horizontal/vertical layout on the pipeline page

### 4. Files Changed

| File | Change |
|------|--------|
| `src/pages/SchedulePage.tsx` | New — weekly schedule with two view modes |
| `src/pages/Index.tsx` | Add "Schedule" tab to HOME_TABS |
| `src/App.tsx` | Add `/schedule` route |

