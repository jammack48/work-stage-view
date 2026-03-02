

## Make the Close-Out Flow Interactive and Editable

The current flow is read-only — managers can't edit costs, check materials, match supplier docs, or adjust line items. Here's the plan to make each step properly interactive.

### Step 1: Review Job Sheet — Make it actionable
- Add expandable sections for **Materials Used** (list each material with qty, supplier, unit price) and **Photos** (thumbnail grid)
- Add a checklist-style verification: tick off "Time entries verified", "Photos complete", "Notes reviewed" — all must be ticked to proceed
- Add an **"Open Job Card"** link button so the manager can jump out and check details if needed

### Step 2: Reconcile Costs — Fully editable
- Show each **material line item** individually (not just a "Materials" total) with editable actual cost inputs
- Add a **Supplier Doc Match** column — each material row gets a checkbox/icon: "Receipt matched" (green tick) or "Unmatched" (orange warning)
- Labour rows become editable: show each staff member's hours with inline editable actual-hours and rate fields
- Extras rows editable with inline inputs
- Add an **"Add Cost"** button to add unquoted extras (e.g., unexpected parts)
- Running totals auto-update as values change
- Margin recalculates live

### Step 3: Generate Invoice — Editable line items
- Each line item (labour, materials, extras) shown as an editable row — can adjust description, qty, unit price
- Add/remove line items
- Toggle line item visibility (include/exclude from invoice)
- Subtotal, GST, Total update live

### Step 4: Send — No changes needed (already good)

### Step 5: Done — No changes needed

### Files to change

1. **`src/components/job/JobCloseOutFlow.tsx`** — Major rewrite of steps 1-3:
   - Step 1: Add material list, photo thumbnails, verification checklist
   - Step 2: Replace summary rows with per-item editable rows, supplier match toggles, add-cost button
   - Step 3: Editable invoice line items with add/remove/toggle

2. **`src/data/dummyJobDetails.ts`** — Add `supplierDoc` field to `MaterialItem` interface (e.g., `{ matched: boolean, ref?: string }`) to support reconciliation matching

