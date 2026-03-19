

## Trade Selection + Trade-Specific Demo Data

### Overview
Add a "What's your trade?" step as the first screen in the ModePicker flow. Each trade gets its own set of dummy jobs stored in a Supabase `demo_jobs` table with a `trade` column. Remove the OnboardingCarousel intro explanation screen.

### Flow Change
```text
Current:  Splash → OnboardingCarousel → ModePicker (Intro/Manager/Employee/Timesheet)
New:      Splash → TradePicker → ModePicker (Intro/Manager/Employee/Timesheet)
```

### Trades (8 options)
Electrical, HVAC, Plumbing, Glazing, Building, Mechanic, Painting, Landscaping

---

### Step 1 — Database: Create `demo_jobs` table

Create table in your external Supabase with a `trade` column:

```sql
CREATE TABLE public.demo_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade text NOT NULL,
  job_id text NOT NULL,
  client text NOT NULL,
  job_name text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  age_days integer NOT NULL DEFAULT 0,
  urgent boolean NOT NULL DEFAULT false,
  stage text NOT NULL DEFAULT 'Lead',
  has_unread boolean NOT NULL DEFAULT false
);
```

Then seed ~10 jobs per trade (80 total) covering all pipeline stages — realistic job names/values per trade (e.g. Plumbing: "Hot Water Cylinder Replace $2,400", Painting: "3-Bedroom Interior Repaint $4,800").

### Step 2 — Add trade to AppModeContext

- Add `trade` state (stored in localStorage as `tradie-app-trade`)
- Expose `trade`, `setTrade`, `clearTrade` from context
- `clearMode` also clears trade

### Step 3 — Create TradePicker component

New `src/components/TradePicker.tsx`:
- Grid of 8 trade cards with icons (Zap for Electrical, Droplets for Plumbing, etc.)
- On tap, saves trade to context and proceeds to existing ModePicker
- Simple, clean layout matching existing card style

### Step 4 — Update App.tsx flow

- Remove `OnboardingCarousel` and its `onboardingCompleted` state entirely
- After splash, check `trade` — if null show `TradePicker`, then `ModePicker`
- Flow: `!splashDismissed → Splash` → `!trade → TradePicker` → `!mode → ModePicker` → App

### Step 5 — Update DemoDataContext to use trade-filtered data

- Replace local `jobs.json` seed with a fetch from `demo_jobs` table filtered by selected trade
- Service function: `fetchDemoJobs(trade: string)` in `dbDemoService.ts`
- Jobs still reset on refresh (re-fetched from DB each time)

### Step 6 — Seed data insertion

Insert realistic demo jobs for all 8 trades via a seed script — 10 jobs each across the standard stages (Lead, To Quote, Quote Sent, Won, Scheduled, In Progress, To Invoice, Complete).

### Files to create
- `src/components/TradePicker.tsx`

### Files to edit
- `src/contexts/AppModeContext.tsx` — add trade state
- `src/App.tsx` — remove OnboardingCarousel, add TradePicker step
- `src/contexts/DemoDataContext.tsx` — fetch from `demo_jobs` by trade
- `src/services/dbDemoService.ts` — add `fetchDemoJobs(trade)`

### Files to delete
- `src/components/OnboardingCarousel.tsx` (no longer needed)

