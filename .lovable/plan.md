

## Quote Creation Funnel — Guided Step-by-Step Flow

Transforms `/quote/new` from a flat page into a clean, top-down guided funnel. The user walks through focused steps before landing in the builder. Existing quote editing (`/quote/:id`) remains unchanged.

### The Flow

```text
Step 1 ─ Select Customer
Step 2 ─ Confirm Address
Step 3 ─ Choose Bundle or Write Description
         ↓
    Quote Builder (pre-populated)
```

Each step is a single focused card, centered on screen, with large tap targets. Progress shown as numbered dots at the top.

### Step 1 — Select Customer

- Searchable list of customers from `DUMMY_CUSTOMERS`
- Each row shows: name, phone, address snippet
- Large rows (min-h-14) for easy mobile tapping
- "Skip — no customer yet" option at the bottom
- Selecting a customer auto-advances to Step 2

### Step 2 — Confirm Address

- Pre-fills the selected customer's address
- Single editable input field
- Option to type a different site address
- Back button returns to Step 1
- "Next" button advances to Step 3

### Step 3 — Bundle or Custom Description

- Bundle chips displayed as cards (not just chips), each showing:
  - Bundle name (e.g. "Heat Pump Install")
  - Short description (e.g. "Install split-system heat pump including electrical connection and commissioning")
  - Estimated value range
- OR a "Custom Quote" card with a textarea for writing a scope description
- Selecting a bundle or writing a description and clicking "Start Quote" finishes the funnel

### After Funnel Completes

- Switches to the existing Quote workspace (PageToolbar with Overview, Line Items, Notes, History tabs)
- Header shows: "Quote — [Bundle Name or Custom]", customer name, Draft badge
- Line Items tab: scope description box pre-filled, sections pre-populated from bundle (if selected)
- If no bundle chosen, sections start empty with just the description

### Technical Details

**New file: `src/components/quote/QuoteFunnel.tsx`**
- Multi-step component with `useState` tracking current step (1-3)
- Collects: `customer`, `address`, `bundleId | description`
- On completion, calls `onComplete(data)` callback
- Progress indicator: three circles at top, filled as user progresses
- Centered layout: `max-w-lg mx-auto` on desktop, full-width on mobile
- Large touch-friendly buttons (`h-12`)
- Back button on steps 2 and 3
- Clean, minimal — no clutter

**Modified: `src/pages/QuotePage.tsx`**
- When `id === "new"`: render `QuoteFunnel`
- When funnel completes: switch to workspace view with collected data passed through
- `QuoteFunnel` result flows into: page heading (customer name, quote title), scope textarea, and bundle pre-population
- When `id` is an existing job ID: skip funnel, go straight to workspace (existing behaviour)

**Modified: `src/data/dummyJobDetails.ts`**
- Add `description` field to `BundleTemplate` interface
- Each bundle gets a short scope summary (e.g. "Supply and install split-system heat pump including electrical connection, commissioning, and building consent")

**Modified: `src/components/job/QuoteTab.tsx`**
- Accept optional `initialBundle` prop
- When provided, auto-applies the bundle on mount instead of starting empty
- Existing behaviour unchanged when no prop is passed

**No new dependencies. No new routes.**

### Funnel Visual Design

```text
+----------------------------------+
|  ● ○ ○   New Quote               |
+----------------------------------+
|                                  |
|   Who is this quote for?         |
|                                  |
|   [🔍 Search customers...]      |
|                                  |
|   ┌────────────────────────┐     |
|   │ Dave Thompson           │     |
|   │ 021 555 1234 · Auckland │     |
|   └────────────────────────┘     |
|   ┌────────────────────────┐     |
|   │ Sarah Mitchell          │     |
|   │ 027 555 5678 · Wgtn     │     |
|   └────────────────────────┘     |
|   ...                            |
|                                  |
|   [ Skip — no customer yet ]     |
|                                  |
+----------------------------------+
```

```text
+----------------------------------+
|  ● ● ○   New Quote               |
+----------------------------------+
|                                  |
|   ← Back                        |
|                                  |
|   Site Address                   |
|                                  |
|   ┌────────────────────────┐     |
|   │ 12 Queen St, Auckland  │     |
|   └────────────────────────┘     |
|                                  |
|          [ Next → ]              |
|                                  |
+----------------------------------+
```

```text
+----------------------------------+
|  ● ● ●   New Quote               |
+----------------------------------+
|                                  |
|   ← Back                        |
|                                  |
|   What's the job?                |
|                                  |
|   ┌────────────────────────┐     |
|   │ 🔧 Service Call        │     |
|   │ Diagnose + fix, travel │     |
|   │ ~$282                  │     |
|   └────────────────────────┘     |
|   ┌────────────────────────┐     |
|   │ ⚡ Heat Pump Install    │     |
|   │ Full install + consent │     |
|   │ ~$1,247                │     |
|   └────────────────────────┘     |
|   ...                            |
|                                  |
|   ┌────────────────────────┐     |
|   │ ✏️ Custom Quote         │     |
|   │ [Describe the work...] │     |
|   │     [ Start Quote ]    │     |
|   └────────────────────────┘     |
|                                  |
+----------------------------------+
```

