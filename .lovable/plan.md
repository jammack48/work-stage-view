

## Fix Work Mode Hardcoded Jobs + Add Roofer Trade

### Problem

1. **Work/Tools mode shows hardcoded generic jobs**: `WorkHome.tsx` calls `generateWeekJobs(weekStart)` without passing the `trade` parameter, so it falls back to the generic `DEFAULT_JOB_NAMES` list ("Kitchen Plumbing", "Roof Repair", etc.) instead of using trade-specific names.

2. **`DEMO_JOBS` constant is hardcoded**: `scheduleData.ts` has a static `DEMO_JOBS` array with 13 generic jobs used for job detail lookups. These are not trade-aware.

3. **No "roofer" trade exists**: Not in the Trade type, not in the TradePicker, not in the schedule job name pools, and no seed data in the database.

4. **`customers` table missing**: The Lovable Cloud database returns 404 for the `customers` table (it doesn't exist yet), causing console errors on every load.

### Plan

**1. Add "roofer" trade everywhere**
- `src/contexts/AppModeContext.tsx` — add `"roofer"` to the `Trade` type and `VALID_TRADES` array
- `src/components/TradePicker.tsx` — add Roofer button with a suitable icon
- `src/components/schedule/scheduleData.ts` — add `roofer` entry to `TRADE_JOB_NAMES` (e.g., "Re-Roof Iron", "Tile Replace", "Gutter Install", "Fascia Repair", "Flashing Repair", "Skylight Install", "Leak Investigation", "Valley Gutter Replace", "Soffit Repair", "Roof Wash & Treat")

**2. Fix WorkHome.tsx — pass trade to schedule generator**
- Import `useAppMode` and pass `trade` to `generateWeekJobs(weekStart, trade)` so work mode schedule shows trade-relevant job names

**3. Make `DEMO_JOBS` trade-aware**
- Update the hardcoded `DEMO_JOBS` array in `scheduleData.ts` to be a function that generates trade-specific static demo jobs, or remove it entirely and have `dummyJobDetails.ts` handle `WK-` prefixed IDs (which it already does at line 258). The static `DEMO_JOBS` can be kept as a fallback but with a note that it's only used for backward-compat detail lookups.

**4. Create `customers` table in database**
- Run a migration to create the `customers` table matching the schema the app expects (id serial, name, phone, email, address, jobs, status, total_spend, notes jsonb, contacts jsonb, job_history jsonb) with public read/write RLS for now (demo app, no auth)

**5. Seed roofer jobs in database**
- Run a migration to insert 10 roofer trade jobs into `demo_jobs` following the same pattern as other trades (spread across all pipeline stages)

### Files to change

| File | Change |
|------|--------|
| `src/contexts/AppModeContext.tsx` | Add `"roofer"` to Trade type and VALID_TRADES |
| `src/components/TradePicker.tsx` | Add Roofer option with icon |
| `src/components/schedule/scheduleData.ts` | Add roofer to TRADE_JOB_NAMES |
| `src/pages/WorkHome.tsx` | Pass `trade` to `generateWeekJobs` |
| Database migration | Create `customers` table + seed 10 roofer jobs |

