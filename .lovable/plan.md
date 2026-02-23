

## Quote Builder v2: Bundles + Stacked Sections

Evolves the current tab-based QuoteTab into a stacked, collapsible layout with one-tap bundle templates.

### What Changes

**1. Replace section tabs with stacked collapsible sections**

Currently Labour/Materials/Extras are behind tabs -- you can only see one at a time. Instead, show all three stacked vertically with collapse toggles. Collapsed sections show just the section name and subtotal. Expanded sections show inline-editable rows.

```text
LABOUR                        $382.50  [v]
  Jake Turner - Strip out...   4.5  $85
  Ben Kowalski - Assist...     4.5  $85
  [+ Add Item]

MATERIALS                     $182.00  [^]  <-- collapsed
EXTRAS                          $0.00  [^]  <-- collapsed
```

This lets users see the full cost breakdown at a glance without tab-switching.

**2. Add Bundles bar at top**

A horizontal scrollable row of pre-set bundle chips above the sections. Tapping a bundle fills all three sections with template items.

```text
[Service Call] [Heat Pump] [Switchboard] [Maintenance] [+ Custom]
```

Bundles defined as static data for now (no persistence). Each bundle contains arrays of labour, material, and extras items with default quantities and prices.

**3. Enhance command palette with section-aware items**

The "Add Item" palette currently only shows materials. Expand it to show items grouped by section (Labour Tasks, Materials, Extras/Permits). When user selects an item, it auto-adds to the correct section -- no need to be "in" that section first.

**4. Universal add input (quick-add bar)**

A single input field at the top of the sections area: "Type to add item...". As user types, it searches across all sections in the palette. Selecting an item adds it to the correct section automatically. This is the "type 3 letters, pick, done" flow.

### Layout (Mobile-First)

```text
+----------------------------------+
| Quote           [Draft] badge    |
+----------------------------------+
| [Service Call] [Heat Pump] [...]  |  <-- Bundle chips (scroll)
+----------------------------------+
| [ Type to add item...        ]   |  <-- Quick-add input
+----------------------------------+
| LABOUR              $382.50  [v] |  <-- Collapsible
|   row / row / row                |
|   [+ Add]                        |
+----------------------------------+
| MATERIALS           $182.00  [v] |
|   row / row / row                |
|   [+ Add]                        |
+----------------------------------+
| EXTRAS                $0.00  [^] |  <-- Collapsed
+----------------------------------+
| Notes [v]                        |
+----------------------------------+
| Summary Card (sticky on mobile)  |
|   Labour / Materials / Extras    |
|   GST / TOTAL                    |
+----------------------------------+
| [Send Quote]  [Save Draft]       |
+----------------------------------+
```

### Technical Details

**Files to modify:**
- `src/components/job/QuoteTab.tsx` -- rewrite layout from tabs to stacked collapsible sections, add bundles bar and quick-add input
- `src/data/dummyJobDetails.ts` -- add bundle templates data and section tags on materialsPool items

**Bundle data structure (in dummyJobDetails.ts):**
- Each bundle has a name, icon, and arrays: `labour[]`, `materials[]`, `extras[]`
- Items reference materialsPool entries where possible
- 4-5 pre-set bundles: Service Call, Heat Pump Install, Switchboard Upgrade, Maintenance, Bathroom Reno

**materialsPool enhancement:**
- Add a `section` field to each item: `"labour" | "materials" | "extras"`
- Add a few labour-type entries (e.g. "Standard install", "Call-out fee") and extras (e.g. "Building permit", "Inspection fee")
- Command palette groups items by section

**QuoteTab component changes:**
- Replace `Tabs` with three `Collapsible` components stacked vertically
- Each section independently collapsible, starts with Labour expanded, others collapsed if empty
- Bundle chips as a horizontal scrollable flex row at top
- Quick-add input uses `Command` inline (not in a dialog) with dropdown suggestions
- "Add Item" button per section still opens the full palette dialog filtered to that section
- All existing functionality preserved: inline editing, Enter-to-add-row, delete, status cycling, notes, summary card, action buttons

**No new dependencies. No new files needed.**

