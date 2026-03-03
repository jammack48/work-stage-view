

## Problem

The Employee "Finished Job" flow (`JobCompletionFlow`) has a "Coming Back?" step buried as step 5 of 7, and it only shows a toggle + notes field -- it doesn't include the "Open Schedule" / "Book Later" booking buttons that the Sole Trader flow has.

The user wants the return-visit booking experience to match the Sole Trader flow: ask upfront if the job is finished or if they're coming back, and if coming back, offer "Open Schedule" and "Book Later" options.

## Plan

### 1. Add a "Job Status" step as the first step in JobCompletionFlow
- File: `src/components/job/JobCompletionFlow.tsx`
- Insert a new `status` step at position 0 in the STEPS array (before "Job Sheet")
- Render "Job Finished" vs "Coming Back" toggle buttons (matching the Sole Trader UI)
- When "Coming Back" is selected, show return notes + "Open Schedule" and "Book Later" buttons
- "Open Schedule" navigates to `/schedule?returnJob=...&returnJobName=...&returnClient=...&returnAddress=...` (same as Sole Trader flow)
- "Book Later" shows toast and closes dialog

### 2. Remove the old standalone "Coming Back?" step
- Remove the existing `return` step (step 5) from STEPS since it's now handled by the status step at the top
- This avoids redundancy

### 3. Conditionally prune steps when coming back without completing
- If user selects "Coming Back" and doesn't need to log full completion data, skip straight to done (same pattern as Sole Trader's `activeSteps` filtering)

### Technical details
- Reuses the same URL parameter pattern (`returnJob`, `returnJobName`, etc.) already consumed by `SchedulePage`
- No changes needed to `SchedulePage` or the time grid components -- they already support this booking mode
- The `handleOpenSchedule` function will close the dialog and navigate, identical to `SoleTraderCloseOutFlow`

