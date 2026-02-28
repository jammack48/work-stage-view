

## Four features to build

### 1. Job Prefix Setting (Settings > Business)

Add a "Job Numbering" section to the Business tab in Settings with two editable fields:
- **Prefix** — text input, default "TB" (e.g. "OE", "TP")
- **Next Number** — number input, default 1, zero-padded to 4 digits

Store in a new `JobPrefixContext` so the prefix is accessible app-wide. Display the formatted ID (e.g. "OE-0001") on job cards, pipeline cards, schedule cards, and the Work app.

**Files:**
- `src/contexts/JobPrefixContext.tsx` — new context with `prefix`, `nextNumber`, `setPrefix`, `setNextNumber`
- `src/pages/SettingsPage.tsx` — add "Job Numbering" section to the `business` tab with prefix input + start number input + live preview ("OE-0001")
- `src/App.tsx` — wrap with `JobPrefixProvider`
- `src/data/dummyJobs.ts` — update `generateId` to accept prefix param; export a helper `formatJobId(prefix, num)`
- Update job ID display in: `StageColumn.tsx`, `ScheduleJobCard.tsx`, `WorkJobCard.tsx`, `OverviewTab.tsx`, `WorkOverviewTab.tsx` — use prefix from context instead of hardcoded "TB-"

### 2. Workers App — Hub tab with documents, training, certs, forms

Add a "Hub" icon to the Work bottom nav (replacing one of the existing items or adding a 4th). Create a new `WorkHub` page with four sections:

- **Company Documents** — list of dummy docs (H&S policy, handbook, SOPs)
- **Training Videos** — list of video links with play icons
- **Certifications** — cards showing cert name, expiry date, status badge (valid/expiring/expired)
- **Forms & Checklists** — downloadable blank forms

**Files:**
- `src/components/WorkBottomNav.tsx` — add Hub icon (`FolderOpen`) as 4th nav item, path `/work-hub`
- `src/pages/WorkHub.tsx` — new page with tab sections for each content type, dummy data
- `src/App.tsx` — add `/work-hub` route in Work mode

### 3. Main App — Team Hub with per-worker document folders

Update the existing Hub page (`/hub`) to include a "Team Documents" section. Each team member gets a folder card that opens to show their documents and certifications. Managers can add docs; workers can also add their own (visible here).

**Files:**
- `src/pages/Hub.tsx` — add a "Team Documents" section below the tile grid with folder cards for each team member (Dave, Mike, Tama, Lisa, Hemi). Each folder expands/navigates to show documents list.
- `src/data/dummyTeamDocs.ts` — new file with dummy document data per worker (certs, licenses, training records)

### 4. Timesheet Page (Work Mode)

Replace the "Coming Soon" timesheet route with a real page. Hours are **auto-filled from job card time entries** — staff review, confirm daily, then submit the full week for manager approval.

**Layout:**
- Week view with Mon–Fri rows
- Each day shows: jobs worked, auto-calculated hours from job time logs, daily total
- Staff can add notes per day (e.g. "travel time")
- "Submit Week" button at bottom — changes status to "Pending Approval"
- Status badge: Draft / Pending / Approved / Rejected

**Files:**
- `src/pages/WorkTimesheet.tsx` — new page with weekly timesheet grid, dummy auto-filled data from schedule jobs, daily totals, submit button
- `src/components/WorkBottomNav.tsx` — update Timesheet path from `/coming-soon` to `/timesheet`
- `src/App.tsx` — add `/timesheet` route in Work mode

**Dummy data structure per day:**
```
{ day: "Monday", jobs: [{ id: "OE-0001", name: "Kitchen Plumbing", hours: 4 }, ...], notes: "", total: 8 }
```

Weekly summary shows total hours, submit status, and manager approval state.

### Files summary

| File | Action |
|------|--------|
| `src/contexts/JobPrefixContext.tsx` | Create |
| `src/pages/SettingsPage.tsx` | Edit — add prefix fields to business tab |
| `src/pages/WorkHub.tsx` | Create |
| `src/pages/WorkTimesheet.tsx` | Create |
| `src/data/dummyTeamDocs.ts` | Create |
| `src/pages/Hub.tsx` | Edit — add team documents section |
| `src/components/WorkBottomNav.tsx` | Edit — add Hub icon, update Timesheet path |
| `src/App.tsx` | Edit — add routes, wrap with JobPrefixProvider |
| `src/data/dummyJobs.ts` | Edit — use prefix from context |
| `src/config/toolbarTabs.ts` | Minor — no changes needed |
| Job card display components | Edit — show prefixed IDs |

