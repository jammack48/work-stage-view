

## Schedule Page Overhaul — Time-Based Layout with Staff Filtering

### What's changing

The current schedule shows jobs as simple cards in a grid without any sense of time positioning. Based on the Fergus reference, the schedule needs to actually show the **working day timeline** with jobs positioned/sized by their time slots, and allow filtering to view **all staff** or **individual staff members**.

### Current problems
- Jobs are just stacked cards — no visual representation of time blocks or duration
- No way to filter by individual staff member
- No "today" highlight on the day strip
- Mobile doesn't show time context at all

---

### 1. Staff filter — checkboxes/chips to toggle visibility

Add a staff filter bar below the heading:
- "All" chip (selected by default) — shows everyone
- Individual staff chips with their colour dot — toggle on/off
- Clicking a single staff member deselects "All" and shows only that person
- Clicking "All" resets to everyone
- State: `selectedStaff: string[]` (empty = all)

### 2. Day strip with "Today" highlight

Replace the current week nav with a horizontal day strip (like Fergus):
- Mon–Sun row showing day name + date number
- Today's date gets a filled circle/highlight (primary colour)
- Tapping a day on mobile selects that day for the single-day view
- Keep prev/next week arrows at the edges

### 3. Desktop view — Time axis (vertical) with days across

**Layout:**
```text
         Mon 24    Tue 25    Wed 26    Thu 27    Fri 28
 7am  |          |          |          |          |
 8am  | ████████ |          | ████████ |          |
 9am  | ████████ | ████████ | ████████ |          |
10am  | ████████ | ████████ |          | ████████ |
11am  |          | ████████ |          | ████████ |
 ...
```
- Time labels down the left (7am–5pm, configurable)
- 5 day columns
- Job cards are **absolutely positioned** within each day column based on `startHour` and sized by `durationHours`
- Jobs from different staff in the same time slot sit side-by-side within the column
- Each job card shows: staff colour left border, job name, client, time range
- When filtered to one staff member, cards take full column width

### 4. Mobile view — Single day with time axis

On mobile, show **one day at a time** (selected from the day strip):
- Time axis runs vertically down the left (7am–5pm)
- Job cards positioned by time, full width
- Staff name shown on each card with colour indicator
- Swipe or tap day strip to change days
- When filtered to one person, it looks like the Fergus screenshot — their name at top, jobs stacked by time

### 5. Demo data updates

Add `address` field to `ScheduleJob` interface and demo data for richer cards (matching Fergus style). Add a `status` field too (e.g. "In Progress", "Scheduled", "Invoiced") shown as a small badge.

---

### Technical Details

**File: `src/pages/SchedulePage.tsx`** — Major rewrite of views

- New state: `selectedStaff: string[]`, `selectedDay: number` (for mobile)
- New component: `StaffFilterBar` — row of toggleable chips
- New component: `DayStrip` — horizontal Mon–Sun with today highlight
- New component: `TimeGridDesktop` — CSS Grid with time rows and day columns, jobs absolutely positioned
- New component: `TimeGridMobile` — single-day vertical timeline
- Job cards: add status badge, address line, keep staff colour border
- Time grid uses `gridTemplateRows` based on hour range (7am–5pm = 10 rows)
- Job positioning: `top` = `(startHour - 7) * rowHeight`, `height` = `durationHours * rowHeight`
- Overlap handling: jobs in same column & overlapping times get `width: 50%` and offset

**Constants:**
- `WORK_START = 7`, `WORK_END = 17` (7am–5pm)
- `HOUR_HEIGHT = 60` (px per hour on desktop), `48` on mobile

**Files changed:**

| File | Change |
|------|--------|
| `src/pages/SchedulePage.tsx` | Major rewrite — time-based grid, staff filter, day strip, mobile single-day view |

