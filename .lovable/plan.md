

## Three-Line Item Rows with Buy/Sell/Markup Pricing

### Problem
Currently each item has two lines: name, then qty × cost price + markup%. The user wants:
1. Global markup applied by default but **overridable per item** (currently global locks all items read-only)
2. Both **buy price** and **sell price** fields — editing sell price back-calculates markup%, editing markup% calculates sell price
3. Three lines per item on mobile to fit everything comfortably

### Changes

**File: `src/components/job/QuoteTab.tsx` — ItemRow component (lines 86-172)**

Redesign to three lines:
- **Line 1**: Item name + delete button
- **Line 2**: Qty + Buy Price (cost) + Sell Price
- **Line 3**: Markup % + Line Total

Pricing logic:
- Editing **buy price** → sell price recalculates using current markup%
- Editing **sell price** → markup% recalculates as `((sell - buy) / buy) * 100`
- Editing **markup%** → sell price recalculates as `buy * (1 + markup/100)`
- Each item stores: `unitPrice` (buy), `sellPrice` (derived or manual), `markup`

Add `sellPrice` to `LineItem` interface. When sell price is set directly, markup auto-updates. When markup is set, sell price auto-updates.

**Global markup override behaviour (lines 204-232)**

Change so global markup sets the **default** for all items but does NOT lock them read-only. Instead:
- When global markup is toggled on or value changes, all items get their markup updated to the global value
- Individual items can then be overridden freely — they just won't track global changes anymore until reset
- Add a small "reset" indicator on items that differ from global

**File: `src/components/job/QuoteTab.tsx` — makeUpdater function (lines 255-258)**

Update the field updater to handle the buy/sell/markup triangle:
- If `unitPrice` changes → recalc `sellPrice` from current `markup`
- If `sellPrice` changes → recalc `markup` from `unitPrice` and new `sellPrice`
- If `markup` changes → recalc `sellPrice` from `unitPrice` and new `markup`

### Files to modify
- `src/components/job/QuoteTab.tsx` — three-line ItemRow, bidirectional sell/markup calc, global markup as default not lock

