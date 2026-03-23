

## Two Fixes: Hide Staff on Quotes + Redesign Schedule Booking Mode

### 1. Quotes Should Not Show Staff

The `QuoteOverviewTab` (line 57-71) displays an "Assigned Staff" card. Quotes are pre-scheduling — staff should never appear here. The underlying dummy data has staff populated, but the quote view should simply not render it.

**File: `src/components/quote/QuoteOverviewTab.tsx`**
- Remove the entire "Assigned Staff" card (lines 57-71). Quotes never have staff. Staff assignment only happens after acceptance, during the scheduling phase.
- Also hide Start Date / Due Date (lines 27-40) — quotes don't have scheduled dates either. These only apply to jobs.

### 2. Redesign Schedule Booking Mode (Fergus-style)

Current problems:
- Duration is pre-selected via 1-8 hour buttons in the banner — messy and takes up space
- Staff filter is hidden during booking mode (line 216: `!isBookingMode`)
- Clicking a slot immediately places the block — no confirmation of duration

**New flow (matches Fergus):**

1. User arrives at `/schedule?bookJob={id}&jobName=...&client=...`
2. **Staff filter bar is VISIBLE** (not hidden) — user selects which staff calendars to view (e.g. just "Dave" or "Dave + Mike")
3. User taps an empty time slot on a staff member's column
4. A **small popover/prompt appears** asking "How long?" with quick-pick buttons (1h, 2h, 3h, 4h, 6h, 8h) + custom input
5. After selecting duration, the job block is created at that slot with that duration
6. User can then **Confirm** (navigates back to job with staff/date) or **tap another slot** to move it
7. Remove the banner duration picker (1-8 hour row)

**Files:**

**`src/pages/SchedulePage.tsx`**
- Show `StaffFilterBar` in booking mode too (remove `!isBookingMode &&` guard on line 216)
- Remove the duration picker row from the booking banner (lines 163-177)
- When `onSlotClick` fires, instead of immediately placing the block, show a duration prompt (small dialog or popover)
- After duration is selected, place the block
- Simplify the banner to just show: job name, selected slot info, Confirm + Cancel buttons
- The `selectedStaff` state feeds into which staff member column was clicked — store this as the assigned staff

**`src/components/schedule/TimeGrid3Day.tsx`**
- Pass back which staff member's column was clicked (not just dayOffset + hour, but also the staff name)
- Update `onSlotClick` signature: `(dayOffset: number, hour: number, staffName?: string) => void`

**`src/components/job/ScheduleJobDialog.tsx`**
- Repurpose as a small "Duration Picker" dialog that appears after tapping a slot
- Shows: "Schedule [jobName] on [day] at [time] for [staff]"
- Duration quick-picks: 1h, 2h, 3h, 4h, 6h, 8h
- Confirm button creates the block and returns to the schedule view with it placed

**Result:**
- Quotes never show staff or dates
- Schedule booking: select staff to view → tap slot → pick duration → confirm
- Clean, intentional, matches Fergus workflow

