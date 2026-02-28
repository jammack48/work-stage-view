

## Enhance Work Mode — Fergus-Style Schedule + Job Completion Workflow

### Current State
Work mode exists but is basic: a simple Today/My Jobs toggle, and job cards that reuse the manage-mode OverviewTab (which shows **Value** — a financial leak). No guided completion flow, no materials-needed morning summary, no bottom nav bar.

### Changes

**1. Redesign WorkHome schedule (Fergus-style)**
- **`src/pages/WorkHome.tsx`** — Full rewrite:
  - Add a 7-day strip (Mon–Sun) like the Fergus screenshot, with selectable days and week navigation arrows
  - Show staff name/avatar at top (currently hardcoded "Dave")
  - Job cards as a vertical list: status badge (colour-coded), time range, job name, client, address + map pin button
  - Add a **"Materials Needed Today"** expandable section at the top — aggregates materials from all today's jobs so staff can see what to pick up before leaving
  - Add a **bottom navigation bar** (fixed): Home, Calendar (→ /schedule), Create Job, Timesheet (→ placeholder)
  - "My Jobs" view: show only active jobs assigned to staff

**2. Create Work-specific Overview tab (no financials)**
- **`src/components/job/WorkOverviewTab.tsx`** — New file. Same layout as OverviewTab but:
  - Remove `Value` row entirely
  - Remove `$` amounts
  - Keep: job name, stage, customer contact, address/maps link, staff, schedule dates
  - Add prominent "Navigate" button (Google Maps link) and "Call Customer" button

**3. Add Job Completion Stepper**
- **`src/components/job/JobCompletionFlow.tsx`** — New file. A multi-step completion dialog/flow triggered by a "Complete Job" button on the WorkJobCard:
  - **Step 1 — Job Sheet**: Pre-populated description from scope/quote. Staff can edit what they actually did.
  - **Step 2 — Time**: Show budgeted hours vs actual. Staff enters actual time if not already logged.
  - **Step 3 — Parts Used**: List materials from scope as "expected". Staff ticks off what they used, can add extras. Toggle: "Stock on hand" vs "Purchase order needed". For PO items, option to note supplier/PO number.
  - **Step 4 — Photos**: Quick photo upload section (before/after).
  - **Step 5 — Compliance** (electrical): COC testing fields, certificate number. Skip if not applicable.
  - **Step 6 — Return Visit?**: Yes/No toggle. If yes, add note about what's needed and preferred date.
  - Final: Submit → marks job as "Complete" (or "Return Required"), navigates back to home.

**4. Update WorkJobCard with completion button + work overview**
- **`src/components/job/WorkJobCard.tsx`** — Modify:
  - Replace `<OverviewTab>` with new `<WorkOverviewTab>` (no prices)
  - Add a prominent "Complete Job" FAB/button that launches the completion flow
  - Add "Start Job" / "On Site" status toggle at top

**5. Bottom nav bar for Work mode**
- **`src/components/WorkBottomNav.tsx`** — New file. Fixed bottom bar with: Home, Calendar, + Create Job, Timesheet, Menu icons (similar to Fergus screenshot)
- **`src/App.tsx`** — Render `<WorkBottomNav />` when `isWorkMode`

**6. Update toolbar tabs**
- **`src/config/toolbarTabs.ts`** — Remove `WORK_HOME_TABS` (replaced by bottom nav). Add `complete` tab to `WORK_JOB_EXTRAS`.

### Files Summary

| File | Action |
|------|--------|
| `src/pages/WorkHome.tsx` | Rewrite — Fergus-style day strip, job list, materials summary |
| `src/components/job/WorkOverviewTab.tsx` | Create — overview without financials |
| `src/components/job/JobCompletionFlow.tsx` | Create — multi-step completion stepper |
| `src/components/job/WorkJobCard.tsx` | Modify — use WorkOverviewTab, add Complete button |
| `src/components/WorkBottomNav.tsx` | Create — fixed bottom navigation |
| `src/App.tsx` | Modify — add WorkBottomNav in work mode |
| `src/config/toolbarTabs.ts` | Modify — update work tabs |

