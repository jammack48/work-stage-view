

## Fix: Job Detail Pages Can't Find Database Jobs

### Problem

The pipeline loads jobs correctly from the database (40 per trade, session-isolated). But when you click a job card (e.g. `E-001`, `P-001`, `R-001`), it navigates to `/quote/E-001` or `/job/E-001` and calls `getJobDetail("E-001")` — which only knows about the old hardcoded job IDs from `dummyJobs.ts`. Result: "Quote not found" / "Job not found".

### Your Questions Answered

1. **Where are the jobs?** They're in Lovable Cloud. The `demo_jobs` table has 360 template rows (40 per trade). The `demo_session_jobs` table has your current session's copy. The pipeline loads them correctly — the problem is only when you click into a job detail page.

2. **Which database?** Lovable Cloud (the one connected to this project). Not the standalone Supabase project you checked separately — that's a different instance.

3. **Should we use the FastAPI backend?** Not yet. The Render backend is just a health-check endpoint right now. For demo mode, Lovable Cloud handles everything. The FastAPI backend will matter later for real business logic, webhooks, integrations, etc.

### Fix: Generate Job Details from Session Data

Instead of looking up job IDs in hardcoded arrays, `getJobDetail` should generate a valid `JobDetail` from the live `DemoJob` data that's already loaded in `DemoDataContext`.

**Approach**: Pass the `DemoJob` object (from context) into the detail pages, and use it to construct a `JobDetail` with generated staff/materials/notes/photos. No DB lookup needed — the pipeline already has all the data.

### Changes

| File | Change |
|------|--------|
| `src/data/dummyJobDetails.ts` | Add `getJobDetailFromDemoJob(demoJob: DemoJob): JobDetail` — takes a `DemoJob` and generates a full `JobDetail` with deterministic staff, materials, notes, photos based on the job ID hash. This replaces the hardcoded lookup for DB-sourced jobs. |
| `src/pages/JobCard.tsx` | When `getJobDetail(id)` returns null but `liveJob` exists (from `useDemoData`), use `getJobDetailFromDemoJob(liveJob)` instead of showing "Job not found". |
| `src/pages/QuotePage.tsx` | Same pattern — when `getJobDetail(id)` returns null but `liveJob` exists, use `getJobDetailFromDemoJob(liveJob)` instead of showing "Quote not found". |
| `src/pages/InvoicePage.tsx` | Same pattern for invoice detail pages. |

### How `getJobDetailFromDemoJob` Works

```text
Input: DemoJob { id: "P-001", client: "Sarah Mitchell", jobName: "Interior Repaint", value: 3200, stage: "Lead", ageDays: 5, urgent: false }

→ Hash the job ID to get a stable seed number
→ Pick staff from staffPool based on seed
→ Pick materials from materialsPool based on seed
→ Generate address, phone, email from seed
→ Output: full JobDetail with all tabs populated
```

This means every job from the database will have a valid detail page with realistic-looking data, and clicking through the full pipeline flow works end to end.

### Result

- Click any pipeline job → opens its detail page with populated data
- Works for all 9 trades, all 40 jobs per trade
- No hardcoded job list dependency
- Full flow: Lead → Quote → Job → Invoice all navigable

