

## Problem

After booking a return visit on the schedule and navigating back to the job card, the completion flow doesn't resume properly:

1. **Sole Trader mode**: `WorkJobCard` explicitly blocks auto-open with `resumeCompletion && !isSoleTrader`, so `SoleTraderCloseOutFlow` never opens.
2. **SoleTraderCloseOutFlow** doesn't accept a `resumeAfterBooking` prop, so it always starts at step 0 (the status question again) instead of skipping to "Job Notes" (step 1).
3. **Employee mode** works correctly already (tested and verified).

## Plan

### 1. Fix WorkJobCard to auto-open the sole trader flow on resume
- **File**: `src/components/job/WorkJobCard.tsx`
- Change: When `isSoleTrader && resumeCompletion`, initialize `unifiedFlowOpen` to `true` instead of only setting `completionOpen` for non-sole-traders.

### 2. Add `resumeAfterBooking` prop to SoleTraderCloseOutFlow
- **File**: `src/components/job/SoleTraderCloseOutFlow.tsx`
- Add `resumeAfterBooking?: boolean` to the `Props` interface.
- When `resumeAfterBooking` is true, initialize `step` to `1` (skipping the "Job Status" question) and `jobFinished` to the appropriate state so the flow continues from "Job Notes" onward.

### 3. Pass the prop from WorkJobCard
- **File**: `src/components/job/WorkJobCard.tsx`
- Pass `resumeAfterBooking={resumeCompletion}` to `SoleTraderCloseOutFlow`.

