

## Restructure Sole Trader "Finish & Invoice" Flow

### Current problem
The step order is wrong and missing key logic. Currently: Job Sheet → Time → Parts → Restock PO → Coming Back? → Photos → Compliance → Reconcile → Invoice → Send → Done. The user wants a natural field-to-billing flow with "coming back?" asked first, and materials renamed appropriately.

### New step order

| # | Step | Label | Notes |
|---|------|-------|-------|
| 1 | status | Job Status | "Is job finished?" or "Need to come back?" If coming back: "Invoice now for work so far?" toggle + return visit notes + schedule date. If no invoice now, skip to Done. |
| 2 | jobsheet | Job Notes | Quick phrases + dictation (existing) |
| 3 | time | Labour | Actual hours (existing) |
| 4 | materials | Materials Used | Renamed from "Parts Used". If vanStock pref: show van stock/supplier toggle + restock PO inline. If no vanStock: just a simple parts list with quantities. No "Reconcile" language. |
| 5 | paperwork | Paperwork | Attach supplier receipts/docs (only if reconcileDocs pref is on, otherwise skip) |
| 6 | photos | Photos | Before/after capture (existing) |
| 7 | certificates | Certificates | Compliance certs, CoC number (existing compliance step) |
| 8 | invoice | Invoice Summary | Editable lines: Labour first, then Materials. Sequence pipeline selector embedded before send button. |
| 9 | send | Send | Email/SMS choice (existing) |
| 10 | done | Done | Margin summary (existing) |

### Key logic changes

1. **Step 1 (Job Status)** is new — a simple toggle "Job finished?" with "Coming back?" branching. If coming back and they choose NOT to invoice partial work, flow ends early with a "Return Visit Scheduled" toast.

2. **Materials step** merges the old "Parts" + "Restock PO" into one step. If vanStock is on, van stock items auto-generate a PO section at the bottom of the same step. If vanStock is off, it's just a simple list of parts/materials used with name + qty.

3. **Paperwork step** only shows if `reconcileDocs` pref is on. Lets them attach receipts/supplier invoices against materials.

4. **Invoice step** includes the `SequenceSelector` component for follow-up sequences, placed before the line items total.

5. Remove the separate "Reconcile Costs" step entirely — sole traders don't reconcile quoted vs actual. They just list what they used and invoice for it.

### File changes

**`src/components/job/SoleTraderCloseOutFlow.tsx`** — Full rewrite of the step definitions and rendering:
- New ALL_STEPS array with the order above
- New "status" step UI with finished/coming-back toggle
- Merge parts + PO into single "materials" step
- New "paperwork" step (conditional on reconcileDocs)
- Rename "compliance" to "certificates"
- Embed SequenceSelector in invoice step
- Remove "reconcile" step
- Update activeSteps filter logic for new skip conditions

