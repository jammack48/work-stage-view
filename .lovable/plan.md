

## Issues Found and Fix Plan

### Issue 1: "To Invoice" jobs in pipeline don't surface the Close Out flow prominently enough
**Current**: Clicking a "To Invoice" job from the pipeline navigates to `/job/{id}` (JobCard page). The "Close Out Job" button exists but is a small pulsing text button in the heading bar — easy to miss.
**Fix**: On the JobCard page, when the job stage is "To Invoice", auto-open the `JobCloseOutFlow` dialog on first render so the user lands directly in the close-out process. Add a URL param (`?action=closeout`) so pipeline links can trigger it, and update the ExpandedStagePanel row click for "To Invoice" jobs to navigate with that param. The "Close Out Job" button stays as a manual trigger too.

### Issue 2: Messages tab "Back" exits the entire job card instead of returning to the job card
**Current**: The PageToolbar "Back" button on JobCard always navigates to `/` (pipeline). If the user is on the messages tab (or any sub-tab), hitting Back leaves the job card entirely.
**Fix**: Change the JobCard `onTabChange` handler: when `id === "back"` and `activeTab !== "overview"`, set activeTab to `"overview"` instead of navigating away. Only navigate to pipeline when already on the overview tab.

### Issue 3: Audit pipeline stage flows for consistency
After reviewing all stages:
- **Lead**: Opens LeadActionMenu (triage) — correct
- **To Quote / Quote Sent**: Navigates to `/quote/{id}` — correct
- **In Progress**: Navigates to `/job/{id}` — correct
- **To Invoice**: Navigates to `/job/{id}` — needs close-out prominence (Issue 1)
- **Paid**: Navigates to `/job/{id}` — correct

No other stage-level issues found.

### Files to change

1. **`src/pages/JobCard.tsx`**
   - Read `?action=closeout` from search params; if present and stage is "To Invoice", auto-open `JobCloseOutFlow`
   - Change Back button logic: if `activeTab !== "overview"`, go to overview first; only navigate away from overview

2. **`src/components/ExpandedStagePanel.tsx`**
   - For "To Invoice" row clicks, navigate to `/job/{id}?action=closeout` so the close-out flow opens automatically

3. **`src/components/StageColumn.tsx`**
   - For "To Invoice" color card clicks, append `?action=closeout` to the navigation URL

