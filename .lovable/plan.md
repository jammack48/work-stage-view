

## Problem

The migration creating `demo_sessions`, `demo_jobs`, and `demo_customers` ran against the **Lovable Cloud** database, but your app points to your **external** Supabase project (`qrkojbfayjrtrlrmgzry`). That external DB has no tables, hence the persistent 404 errors.

## New Architecture

Based on your answers:
- **Customers** → stored and loaded from your external Supabase DB (persistent across refreshes)
- **Jobs / pipeline changes** → tracked in browser `sessionStorage` (wiped on every refresh)
- **On refresh** → jobs reset to seed data; customers reload from Supabase

## Plan

### Step 1: Create customers table on your external Supabase

You'll need to run this SQL in your **external** Supabase SQL Editor (`qrkojbfayjrtrlrmgzry`):

```sql
CREATE TABLE public.customers (
  id serial PRIMARY KEY,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  jobs integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'leads',
  total_spend numeric NOT NULL DEFAULT 0,
  notes jsonb NOT NULL DEFAULT '[]',
  contacts jsonb NOT NULL DEFAULT '[]',
  job_history jsonb NOT NULL DEFAULT '[]'
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to customers"
ON public.customers FOR ALL TO public USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
```

No session-scoping needed since it's open demo data.

### Step 2: Seed customer data into Supabase

After the table is created, insert the seed customers from `customers.json` into the new `customers` table via a one-time seed script or SQL insert.

### Step 3: Simplify `DemoDataContext.tsx`

- Remove all session-based logic (`ensureSession`, `sessionId` state)
- On mount: fetch customers from Supabase (`public.customers`), load jobs from JSON seed into sessionStorage
- `updateJobStage` → only updates sessionStorage (no DB call)
- `addCustomer` → inserts into Supabase `customers` table and refreshes
- `resetDemo` → clears sessionStorage jobs (reloads from JSON seed); optionally re-fetches customers from DB

### Step 4: Simplify `dbDemoService.ts`

- Remove `demo_sessions`, `demo_jobs` references entirely
- Remove `createSession`, `ensureSession`, `dbResetSession`, `dbUpdateJobStage`, `dbAddJob`
- Keep only: `fetchCustomers()`, `dbAddCustomer()`, `dbUpdateCustomer()` — all hitting `public.customers` table
- Jobs stay purely in-memory via sessionStorage using the existing `demoStorage.ts` / `demoService.ts` utilities

### Step 5: Clean up unused tables

Remove the Lovable Cloud migration tables (`demo_sessions`, `demo_jobs`, `demo_customers`) since they're on the wrong DB and no longer needed.

### Files changed
- `src/services/dbDemoService.ts` — simplified to customers-only Supabase operations
- `src/contexts/DemoDataContext.tsx` — hybrid: customers from DB, jobs from sessionStorage
- `src/services/demoService.ts` — keep as-is for job sessionStorage operations

### No code changes needed
- `src/lib/supabase.ts` — stays as-is (external DB client)
- `src/demo/demoStorage.ts` — stays as-is (sessionStorage for jobs)

