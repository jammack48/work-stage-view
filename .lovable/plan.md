

## Plan: Enhanced Work Mode New Job Flow

### Step 1 — Customer Selection (replace plain text input)
- Add a searchable customer picker that filters `DUMMY_CUSTOMERS` as user types
- Show matching customers in a dropdown list below the input
- When a customer is selected, auto-populate the address field with their address
- Add a "+ New Customer" button/option at top of dropdown that switches to manual entry mode (name + address both editable)
- Address field remains editable even when auto-populated (for different site)

### Step 2 — Visual Schedule Picker (replace dropdowns)
- Replace date picker + time/duration dropdowns with an inline time grid
- Show the selected date's schedule using the existing `TimeGridMobile`-style layout with hour lines (7am–5pm)
- Add a `DayStrip` at top to pick the date
- Render a draggable "new job" block on the grid, initially placed at 8am spanning 1 hour
- User taps a time slot to set start time, then drags the bottom edge of the block to extend duration (snaps to 30min increments)
- Existing jobs for that day shown in the background (greyed out) so staff can see availability
- Show the computed start time and duration below the grid as confirmation text

### Step 3 — Confirm (mostly same, minor updates)
- Summary card unchanged
- "Start Job" navigates to `/job/TB-NEW`

### Files to modify
- `src/pages/WorkNewJob.tsx` — full rewrite with customer picker + visual schedule grid

