

## Plan: Fix Build Errors + Make Customers Work End-to-End with Database

There are several issues to fix plus the bigger feature of making the pipeline actually persist and be resettable per user.

### 1. Fix build errors

**`src/components/job/JobCompletionFlow.tsx`** — `updateJobStage` is used but `useDemoData()` is never called. Add `const { updateJobStage } = useDemoData();` inside the component (same pattern as SoleTraderCloseOutFlow line 154).

**`src/demo/demoLoader.ts`** — JSON imports lose their literal types (stage/status become `string`). Cast the seed data: `jobs: jobsSeed as DemoJob[]`, `customers: customersSeed as DemoCustomer[]`.

**`src/services/demoService.ts`** — Same widening issue on the `status` field in the mapped customers. Add `as DemoCustomer["status"]` cast on the computed status value.

### 2. Fix CustomerCard to use demo data context

**`src/pages/CustomerCard.tsx`** — Currently imports `getCustomer` from `dummyCustomers.ts` which is a separate hardcoded list of 8 customers. The customer list page uses `useDemoData()` context (40 customers from JSON). So clicking a customer navigates to `/customer/28` but `getCustomer(28)` returns undefined.

Fix: Replace `getCustomer(Number(id))` with a lookup from `useDemoData().customers`. This makes the customer card consistent with the customer list.

### 3. Add "New Customer" form

**`src/pages/Customers.tsx`** — The "Add Customer" button currently shows a "coming soon" toast. Replace with a dialog/sheet containing a simple form (name, phone, email, address). On submit, add the customer to the demo dataset via a new `addCustomer` method.

**`src/contexts/DemoDataContext.tsx`** — Add `addCustomer(customer)` method that appends to the dataset and writes to sessionStorage.

**`src/services/demoService.ts`** — Add `addDemoCustomer()` function.

### 4. Job stage progression resets age to 0

**`src/services/demoService.ts`** `updateDemoJobStage()` — When a job moves to a new stage, set `ageDays: 0` so the color resets to green. The job is "fresh" in its new bucket.

### 5. Database-backed pipeline with per-user reset

This is the key architectural question. Currently everything is in sessionStorage, which means:
- Data resets on tab close
- No persistence across devices
- No multi-user testing

**Approach: Database tables with a "demo session" concept**

Create database tables for `demo_sessions`, `demo_jobs`, `demo_customers`. Each session gets a copy of the seed data. A "Reset Pipeline" button creates a fresh session. No auth required — sessions are identified by a UUID stored in localStorage.

**Tables:**
- `demo_sessions` (id uuid, created_at, label text) — each test session
- `demo_jobs` (id, session_id, client, jobName, value, ageDays, stage, ...) — jobs per session  
- `demo_customers` (id, session_id, name, phone, email, ...) — customers per session

**RLS:** Public read/write filtered by session_id (no auth needed for demo/testing).

**Reset flow:** "Reset Pipeline" drops all rows for the current session and re-inserts seed data. Or creates a new session UUID entirely.

**Migration path:** Update `dataService` to call database instead of sessionStorage. The `DemoDataContext` switches from local state to react-query backed by the database.

### Files changed
1. `src/components/job/JobCompletionFlow.tsx` — fix missing `useDemoData()` call
2. `src/demo/demoLoader.ts` — cast JSON imports to typed arrays
3. `src/services/demoService.ts` — cast status, reset ageDays on stage change
4. `src/pages/CustomerCard.tsx` — use demo context instead of dummyCustomers
5. `src/pages/Customers.tsx` — add new customer dialog
6. `src/contexts/DemoDataContext.tsx` — add `addCustomer` method
7. DB migration — create demo_sessions, demo_jobs, demo_customers tables
8. `src/services/dataService.ts` — swap sessionStorage for database calls

