

## Fix: Schedule jobs not found when clicked

### Problem
The `generateWeekJobs` function creates jobs with dynamic IDs like `WK-964-30`, but `getJobDetail()` in `dummyJobDetails.ts` only looks up the static `DEMO_JOBS` array (which has IDs like `TB-0501`). So clicking any generated schedule job navigates to `/job/WK-964-30` → "Job not found".

### Solution

**`src/data/dummyJobDetails.ts`** — Update `getJobDetail` to handle dynamic schedule IDs:
- After the static `DEMO_JOBS` lookup fails, check if the ID matches the `WK-` pattern
- If so, parse the ID to extract enough info to generate a synthetic `JobDetail` with plausible dummy data (staff, materials, notes, photos, time entries)
- This way every dynamically generated schedule job is clickable and shows a full job card

**`src/components/schedule/ScheduleJobCard.tsx`** — Pass job metadata via navigation state so `getJobDetail` can use it:
- When navigating to a job, pass the schedule job's `jobName`, `client`, `address`, and `status` as route state
- This gives `getJobDetail` real data to populate the card instead of generic placeholders

**`src/pages/JobCard.tsx`** — Read route state and pass overrides to `getJobDetail`:
- Extract job metadata from `location.state` and pass as overrides so the job card shows the correct name/client/address

This ensures every generated schedule job is clickable and displays meaningful detail, for any week.

