

## Three Fixes: Schedule via Calendar, Revert Stage Labels, Populate Staff Card

### 1. Schedule Job → Navigate to Schedule Calendar (not dialog popup)

Instead of opening the `ScheduleJobDialog` popup, clicking "Schedule Job" should navigate to the full Schedule page in booking mode (similar to the existing return-booking flow). The user selects duration first, then gets placed on the calendar to drag/position the job block onto staff timelines.

**Flow:**
- User clicks "Schedule Job" on a Quote Accepted job
- Navigate to `/schedule?bookJob={jobId}&jobName=...&client=...&duration=4`
- Schedule page enters **booking mode** (reuses existing `returnJob` pattern)
- User sees the calendar, selects staff, taps a time slot to place the block
- Confirm → navigates back to job with staff/date populated

**Files:**
- `src/pages/JobCard.tsx` — Replace `ScheduleJobDialog` open with `navigate()` to schedule page with booking params
- `src/components/job/OverviewTab.tsx` — Same: Schedule button navigates instead of opening dialog
- `src/pages/QuotePage.tsx` — Same change
- `src/pages/SchedulePage.tsx` — Extend booking mode to support `bookJob` param (in addition to existing `returnJob`), allow staff selection + slot click to place the job block

### 2. Revert Stage Column Labels, Move Green Badges to PipelineFlowBanner

The green bubble badges on stage column headers (StageColumn.tsx line 182) are wrong. Revert to plain text labels. Instead, the horizontal arrow bar (`PipelineFlowBanner.tsx`) should highlight the active stage with a green pill badge.

**Files:**
- `src/components/StageColumn.tsx` (line 182) — Remove `bg-[hsl(var(--status-green))] text-white font-bold rounded-full` wrapper, return to plain text with `break-words`
- `src/components/PipelineFlowBanner.tsx` (line 17-23) — When `activeStage === stage`, render the stage name inside a green rounded-full pill badge instead of just changing text color to `text-primary`

### 3. Populate Staff & Schedule Card After Scheduling

When the user confirms scheduling (selects staff + date on the calendar and returns), the Staff & Schedule card in the Overview should populate with the selected data instead of staying empty.

**Files:**
- `src/pages/JobCard.tsx` — Read `searchParams` for `bookedStaff`, `bookedDate` etc. on return from schedule page, update job detail state with the assigned staff and dates
- `src/components/job/OverviewTab.tsx` — Accept optional `scheduledStaff` and `scheduledDate` props to override the empty state when scheduling has been completed
- `src/pages/SchedulePage.tsx` — On confirm, navigate back with staff/date params in the URL

### Summary of Visual Changes
- Stage column headers: back to plain text (as they were before)
- Pipeline flow banner: active stage gets green pill badge
- Schedule Job: opens the full calendar page, not a dialog
- After scheduling: Staff & Schedule card fills in with assigned staff and date

