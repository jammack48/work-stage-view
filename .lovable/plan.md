

## Quote Builder — "Write a List, Not Fill a Form"

Replaces the current basic QuoteTab with an interactive, inline-editable quote builder optimized for speed on mobile.

### Layout (Mobile-First, Single Column)

```text
+----------------------------------+
| [Labour] [Materials] [Extras]    |  <-- Section pill tabs
+----------------------------------+
| Item Name          Qty    $      |  <-- Inline-editable rows
| Copper Pipe 15mm    4    $128    |
| PVC Elbow 90        12   $54    |
| [+ Add Item]                     |  <-- Opens command palette
+----------------------------------+
| Labour       $850.00             |  <-- Sticky summary card
| Materials    $182.00             |
| Extras       $150.00             |
| GST (15%)    $177.30             |
| TOTAL        $1,359.30           |
+----------------------------------+
| [Send Quote]  [Save Draft]       |  <-- Large action buttons
+----------------------------------+
```

### Section Tabs (Labour / Materials / Extras)

- Simple pill-style tabs at top of quote area (not a separate sidebar)
- Each section shows its own line items
- Labour: pre-populated from timeEntries (staff x hours x rate)
- Materials: pulled from job.materials, inline editable
- Extras: starts empty, user adds ad-hoc items
- Notes section available as a collapsible text area below the line items

### Line Item Rows -- Inline Editing

- Each row shows: Item name | Qty | Unit price | Line total
- Tap any field to edit it directly (input appears in-place)
- Enter key on last row auto-creates a new blank row
- Swipe or tap X to delete a row
- All totals recalculate instantly on every change

### Add Item -- Command Palette

- "+" button opens a command palette (using existing cmdk component)
- Searches against the materialsPool data for auto-suggest
- Shows item name, unit, and last-used price
- Selecting an item adds it as a new row with qty=1
- Typing a custom name that doesn't match creates a blank item
- Feels like: type 3 letters, pick, done

### Summary Card -- Always Visible

- Sticky at bottom on mobile, fixed panel on desktop
- Shows: Labour total, Materials total, Extras total, GST (15%), Grand Total
- Updates live as line items change
- Quote status badge: Draft (neutral/muted), Sent (amber/orange), Approved (green)

### Action Buttons

- "Send Quote" -- primary, full-width on mobile
- "Save Draft" -- secondary/outline
- Both large (h-12) with high contrast, matching existing button patterns
- For now these just show a toast (no backend yet)

### State Management

- All quote state managed with useState inside QuoteTab
- Initialised from job.materials, job.labourTotal, job.extrasTotal
- No persistence yet -- purely flow/UI demo
- Quote status cycles: Draft -> Sent -> Approved (tap the badge to cycle for demo)

### Technical Details

**Files to modify:**
- `src/components/job/QuoteTab.tsx` -- complete rewrite with new builder UI

**No new files needed.** Uses existing components:
- `cmdk` (Command palette, already installed)
- Card, Button, Input from shadcn/ui
- Badge colours from existing CSS variables

**Data source:** Uses `materialsPool` from `dummyJobDetails.ts` as the auto-suggest catalogue. Labour rows generated from `job.timeEntries`. No changes to data files.

**No new dependencies required.**
