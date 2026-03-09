

## Diagnosis

There are two separate issues preventing your database from working:

1. **Schema cache is stale** — PostgREST (the API layer) hasn't picked up your new tables yet, causing `PGRST205` ("Could not find the table") errors. This is why every request to `demo_sessions`, `demo_jobs`, and `demo_customers` returns 404.

2. **RLS policies are RESTRICTIVE instead of PERMISSIVE** — Your current policies use `Permissive: No`, which means they act as *additional* restrictions rather than grants. With no permissive policy present, all access is denied even after the cache refreshes.

The Firebase and LinkedIn errors in your inspector are from the Lovable editor itself, not your app — you can ignore those.

## Plan

### Step 1: Fix RLS policies and reload schema cache
Run a single migration that:
- Drops the existing restrictive policies on all three tables
- Creates new **permissive** policies allowing full public access (appropriate for anonymous demo sessions)
- Sends `NOTIFY pgrst, 'reload schema'` to force the API to recognize the tables

### Step 2: No code changes needed
The frontend code (`dbDemoService.ts`, `DemoDataContext.tsx`) is already correct — it will auto-seed demo data on first load once the database is accessible. After the migration, refreshing the preview will trigger session creation and data population automatically.

