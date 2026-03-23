

## Three Changes: Green Bubble Stage Labels + Empty Staff/Schedule + Schedule Button in Overview

### Issues from Screenshots

1. **Stage labels in the arrow bar** (e.g. "QUOTE SENT", "QUOTE ACCEPTED") just change text color to green when they match the selected Simple bucket — hard to read. Should use the same bold green bubble style as the Simple/Advanced toggle.

2. **Staff & Schedule card on the Job Overview** comes pre-populated with dummy staff (Jake Turner, Ben Kowalski, Maia Johnson) and dates. For a "Quote Accepted" job that hasn't been scheduled yet, this should be **empty** — showing "No staff assigned" and no dates — until the user explicitly schedules via the dialog.

3. **Schedule Job button** should also appear **inside the Overview tab** (in the Staff & Schedule card), not just in the top heading bar. This makes it obvious where to assign staff.

### Files to Change

**`src/components/StageColumn.tsx`**
- The stage label in the header currently uses plain text. When the stage matches the active Simple bucket (or always in Advanced mode), render the stage name inside a green rounded-full pill badge (`bg-[hsl(var(--status-green))] text-white font-bold rounded-full px-2 py-0.5 text-[10px]`) — same style as the Simple/Advanced toggle buttons. This replaces the current plain text + green color approach.

**`src/components/job/OverviewTab.tsx`**
- Make the Staff & Schedule card **stage-aware**: if `job.stage` is "Quote Accepted" or "Lead" or any pre-scheduling stage, show empty state for staff (already handled by `job.staff.length === 0` check) and hide/blank the dates.
- The issue is the dummy data always pre-fills staff. Fix: when stage is "Quote Accepted", override to show empty staff and "Not scheduled" for dates.
- Add a **"Schedule Job"** button inside the Staff & Schedule card (only when stage is "Quote Accepted"). Clicking it opens the `ScheduleJobDialog`. Pass an `onSchedule` callback prop from `JobCard.tsx`.

**`src/pages/JobCard.tsx`**
- Pass `onSchedule={() => setScheduleOpen(true)}` and `job.stage` to `OverviewTab` so the overview can trigger the schedule dialog.

**`src/data/dummyJobDetails.ts`**
- For jobs with stage "Quote Accepted", set `staff: []`, `startDate: ""`, `dueDate: ""` so the overview naturally shows empty state.

### Result
- Stage labels in the pipeline arrow bar use bold green pill badges — matching the toggle style, much easier to read
- Quote Accepted jobs show empty Staff & Schedule with a prominent "Schedule Job" button
- Scheduling is always manual — no pre-populated data until the user assigns it

