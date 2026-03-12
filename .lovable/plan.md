

## Problem Diagnosis

The stages and variations code IS in the codebase and working correctly. The issue is **how you're navigating to the job**.

You're currently on `/quote/TB-0101` — the **Quote page**, which has its own tab set (`QUOTE_EXTRAS`) and doesn't include a Stages tab. The Stages tab only appears on the **Job Card** page (`/job/TB-0101`).

The three project jobs with stages are `TB-0101`, `TB-0301`, `TB-0501`. When you click TB-0101 from the pipeline, it likely opens as a quote (since it's in the "Lead" stage), not as a job card.

## What Needs Fixing

1. **Add `jobType` to `jobs.json` seed data** — mark TB-0101, TB-0301, TB-0501 as `"jobType": "project"` so the pipeline can show a visual indicator (e.g., a small "Project" badge on the card).

2. **Show a "Project" badge on pipeline cards** for project-type jobs so users can distinguish them from service jobs.

3. **Add Stages tab to the Quote page** — since project jobs in early pipeline stages (Lead, To Quote, Quote Sent) open as quotes, the stages should be visible there too. Add `{ id: "stages", label: "Stages", icon: Layers }` to `QUOTE_EXTRAS`.

4. **Ensure the OverviewTab stages summary card renders on the Quote overview** — currently the stages progress card is only in the Job Card's OverviewTab. The QuoteOverviewTab needs the same treatment for project jobs.

## Files to Change

| File | Change |
|------|--------|
| `src/demo-data/jobs.json` | Add `"jobType": "project"` to TB-0101, TB-0301, TB-0501 |
| `src/config/toolbarTabs.ts` | Add stages tab to `QUOTE_EXTRAS` |
| `src/pages/QuotePage.tsx` | Import `StagesTab`, add to tab content map, pass stages data |
| `src/components/quote/QuoteOverviewTab.tsx` | Add stages progress summary card for project jobs |
| `src/components/StageColumn.tsx` | Show small "Project" badge on pipeline cards with `jobType: "project"` |

## What Stays the Same

- All existing StagesTab component code (already correct)
- Job Card page stages (already working for `/job/TB-0101`)
- Demo data model, service layer, backend

