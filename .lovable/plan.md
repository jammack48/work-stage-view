

## Fix schedule job generation

### Problems
1. **Overlapping jobs per person** — The generator randomly assigns start times without checking if that staff member already has a job at that time. A tradesman can only be at one job at a time.
2. **No weekend/today coverage** — Only generates Mon–Fri (days 0–4). If today is Saturday or Sunday, or if the week calculation is off, no jobs appear.

### Solution

**`src/components/schedule/scheduleData.ts` — Rewrite `generateWeekJobs`:**

- **Sequential scheduling per staff member**: Track each staff member's next available hour (starting at 7am). When assigning a job to a person on a given day, set `startHour` to their next free slot and advance it by the job's duration. This guarantees no overlaps.
- **Generate for all 7 days** (Mon–Sun, days 0–6), with lighter weekends (0–1 jobs) and busier weekdays (2–4 jobs). This ensures today always has jobs regardless of what day it is.
- **Realistic durations**: Mix of short (1.5–2hr) and long (3–6hr) jobs so a tradesman's day looks real — e.g. 7am–10am one job, 10am–12pm another, 1pm–4pm a third.
- **Per-day staff tracker**: For each day, maintain a `Map<string, number>` of staff → next available hour. Pick staff who still have availability before `WORK_END`.

**No other files need changes** — `WorkHome.tsx` and `SchedulePage.tsx` already consume the output of `generateWeekJobs`.

