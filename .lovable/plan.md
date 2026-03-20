
Goal: make the pipeline use backend-loaded trade jobs only, with no generic/local seed jobs appearing when you switch trades.

What I found:
- The pipeline already requests the correct trade jobs from the backend (`fetchDemoJobs(trade)`), and the network log for `painting` returns the right painting-only records.
- The main problem is in `src/contexts/DemoDataContext.tsx`:
  - `jobs` starts from `jobs.json` (`loadSeedJobs()`), so the UI can show old/generic jobs before the backend response arrives.
  - On fetch failure or empty results it falls back to `jobs.json`, which violates your “no hardcoded jobs anymore” requirement.
  - When changing trade, the previous trade’s jobs can remain visible until the new request finishes.

Implementation plan:
1. Make backend jobs the only source for pipeline jobs
- Update `src/contexts/DemoDataContext.tsx` so `jobs` starts empty, not from `jobs.json`.
- Remove all fallback paths that call `loadSeedJobs()` for pipeline jobs.
- When `trade` changes, immediately clear current jobs and set loading before fetching the new trade’s records.

2. Add proper loading/error states instead of showing wrong jobs
- Keep `loading` true until the selected trade’s jobs finish loading.
- Add a simple empty/error state for the pipeline if the backend returns no rows or errors, instead of silently showing local seed data.
- This prevents electrical/roofing-looking jobs from flashing when Painting is selected.

3. Make reset behavior reload from backend only
- Update `resetDemo()` in `DemoDataContext` to refetch the active trade from the backend only.
- Remove any reset path that restores `jobs.json` into the pipeline.

4. Verify every trade path
- Check the full trade flow for all 8 trades:
  - Electrical
  - HVAC
  - Plumbing
  - Glazing
  - Building
  - Mechanic
  - Painting
  - Landscaping
- Confirm each selection loads only matching pipeline jobs and never shows leftover jobs from the previous trade.

Files to update:
- `src/contexts/DemoDataContext.tsx` — remove local job seed fallback and handle trade-switch loading correctly.
- `src/pages/Index.tsx` — show loading/empty/error state for the pipeline while trade jobs load.
- `src/pages/SettingsPage.tsx` — ensure reset reloads backend data only.

Technical details:
- Keep `fetchDemoJobs(trade)` as the data source.
- Remove `jobsSeed` / `loadSeedJobs()` from the pipeline path.
- On trade change:
  1. clear `jobs`
  2. set `loading = true`
  3. fetch trade jobs
  4. set jobs from response only
  5. if no jobs or error, show a clear UI message instead of fake data

Expected result:
- Choosing Painting shows only painting jobs in the pipeline.
- Switching from one trade to another does not briefly show the old trade or generic sample jobs.
- The pipeline no longer depends on browser-seeded hardcoded job data.
