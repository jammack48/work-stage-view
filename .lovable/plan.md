

## Add multi-week demo jobs to Schedule

### Problem
Current `DEMO_JOBS` only has jobs for `dayOffset` 0-4 (one fixed week). Navigating to next/previous weeks shows an empty calendar.

### Solution
Replace the static `DEMO_JOBS` array with a deterministic generator function `getJobsForWeek(weekStart: Date)` that produces 2-3 jobs per day (Mon-Fri) for **any** week. Uses a simple hash of the date to seed consistent job assignments so the same week always shows the same jobs.

### Changes

**1. `src/components/schedule/scheduleData.ts`**
- Add a `generateWeekJobs(weekStart: Date)` function that creates ~12-15 jobs per week
- Uses a pool of job names, clients, addresses, and staff to deterministically assign 2-3 jobs per day
- Each day gets varied start times and durations across different staff members
- Keep `DEMO_JOBS` as a fallback but the schedule page will use the generator instead

**2. `src/pages/SchedulePage.tsx`**
- Replace `DEMO_JOBS` import with `generateWeekJobs`
- Call `generateWeekJobs(weekStart)` in a `useMemo` keyed on `weekStart`
- This automatically populates jobs for whatever week the user navigates to

**3. `src/pages/WorkHome.tsx`** (if it uses DEMO_JOBS)
- Update to also use the generator so Work mode home shows consistent data

The week navigation (prev/next arrows, "Jump to Today") already works — this just ensures there's data to display on every week.

