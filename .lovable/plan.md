

## Restructure Quote into Per-Bundle Sections

### Current problem
All bundles merge their items into three flat arrays (labour, materials, extras). The user wants each bundle/job to be a distinct named section with its own labour, materials, extras breakdown — like a mini-quote per job.

### New data model
**File: `src/components/job/QuoteTab.tsx`**

Replace `labourItems`, `materialItems`, `extrasItems` with a single array of `QuoteBlock`:

```text
QuoteBlock {
  id: string
  name: string          // "Install Heat Pump", "Install Switchboard"
  description: string   // editable scope text per block
  qty: number           // bundle multiplier (e.g. ×2 heat pumps)
  labour: LineItem[]
  materials: LineItem[]
  extras: LineItem[]
}
```

State becomes: `const [blocks, setBlocks] = useState<QuoteBlock[]>([])`

### UI layout per block
Each block renders as a bordered card:
1. **Block header**: Name (editable) + quantity badge + delete block button
2. **Description**: Inline editable textarea
3. **Labour section** (collapsible with items)
4. **Materials section** (collapsible with items)
5. **Extras section** (collapsible with items)
6. **Block subtotal**

### Bottom "Add" area
After all blocks, show an "Add Another" section with two options:
- **Add Bundle** — opens bundle picker dialog (existing bundle bar becomes this)
- **Add Custom Job** — adds an empty block with blank name/description and empty sections

### Bundle bar removal
Remove the horizontal scrolling bundle bar from the top. Move bundle selection into the "Add Another" flow at the bottom (and also available when quote is empty as the initial prompt).

### Summary card
Totals aggregate across all blocks. Cost, markup, subtotal, GST, grand total remain the same — just summed across all blocks.

### Preview update
**File: `src/components/quote/QuotePreview.tsx`**

Update to receive `blocks: QuoteBlock[]` instead of flat items array. In "detailed" and "sub-section" modes, render per-block sections with block names as headings.

### Initial state
- If `initialBundle` is provided (from funnel), create one block from it
- If loading existing job, create one block from the job's time entries and materials
- Empty new quote shows the "Add Bundle or Custom Job" prompt

### Files to modify
- `src/components/job/QuoteTab.tsx` — new QuoteBlock data model, per-block rendering, "Add Another" bottom section
- `src/components/quote/QuotePreview.tsx` — accept blocks array, render per-block in preview

