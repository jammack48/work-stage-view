

## Unified Sole Trader Flow: Merge "Finished Job" + "Close Out" into One

### Problem
Currently sole traders see TWO buttons: "Finished Job" and "Close Out" — two separate flows that duplicate effort. A sole trader doing and billing the work should have **one flow** that goes from field completion straight through to invoicing.

### Solution

#### 1. Sole Trader Setup Options (`src/components/ModePicker.tsx`)
When user taps "Sole Trader", show a quick config step before entering the app:
- **"Do you carry van stock?"** — toggle (default off). If off, skip the van stock / restock PO steps entirely.
- **"Do you reconcile supplier documents?"** — toggle (default off). If off, skip supplier doc matching in reconciliation.

Store these preferences in `AppModeContext` (persisted to localStorage alongside the mode).

#### 2. Update `AppModeContext` (`src/contexts/AppModeContext.tsx`)
- Add `soleTraderPrefs: { vanStock: boolean; reconcileDocs: boolean }` to context
- Add `setSoleTraderPrefs()` method
- Persist alongside mode in localStorage

#### 3. New Unified Flow: `SoleTraderCloseOutFlow` (`src/components/job/SoleTraderCloseOutFlow.tsx`)
A single flow that merges the completion and close-out steps, skipping irrelevant ones based on prefs:

| Step | From | Skippable? |
|------|------|-----------|
| Job Sheet (quick phrases, dictation) | CompletionFlow | No |
| Time (actual hours) | CompletionFlow | No |
| Parts Used (van stock / supplier toggle) | CompletionFlow | Skip if `!vanStock` |
| Restock PO | CompletionFlow | Skip if `!vanStock` or no van stock items |
| Return Visit? | CompletionFlow | No |
| Photos (before/after) | CompletionFlow | No |
| Compliance | CompletionFlow | No |
| Reconcile Costs (quoted vs actual, supplier match) | CloseOutFlow | Simplified if `!reconcileDocs` (no match column) |
| Generate Invoice (editable lines) | CloseOutFlow | No |
| Send (email/SMS) | CloseOutFlow | No |
| Done (margin summary) | CloseOutFlow | No |

This is essentially the existing `JobCompletionFlow` steps followed by the `JobCloseOutFlow` steps, composed into one stepped dialog. Reuse the existing step rendering code from both components.

#### 4. Update `WorkJobCard.tsx`
- For sole traders: show **one button** — "Finish & Invoice" (or "Close Out Job") — that opens `SoleTraderCloseOutFlow`
- Remove the separate "Finished Job" and "Close Out" buttons for sole trader mode
- Employees still get just the "Finished Job" button (no change)

#### Files to change
1. **`src/contexts/AppModeContext.tsx`** — Add `soleTraderPrefs` state and persistence
2. **`src/components/ModePicker.tsx`** — Add setup step with van stock / reconcile toggles when sole trader is selected
3. **`src/components/job/SoleTraderCloseOutFlow.tsx`** — New unified flow merging both existing flows, with conditional step skipping
4. **`src/components/job/WorkJobCard.tsx`** — Single button for sole trader, two-button stays for employee

