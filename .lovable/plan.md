

# Quote Builder Overhaul — Mobile-First with Markup, Preview & Document Settings

## Changes Overview

### 1. Mobile-friendly two-line item rows with markup
**File: `src/components/job/QuoteTab.tsx`**

Replace the current `ItemRow` (single-line 12-column grid) with a stacked two-line layout:
- **Line 1**: Item name (full width)
- **Line 2**: Qty × Unit Price = Total + Markup% input + delete button

Each item gets a `markup` field (default 0%). The sell price auto-calculates: `unitPrice * (1 + markup/100)`. The total shows the sell price × qty.

Add a global margin toggle at the top of the summary card — a single % input that overrides all per-item markups when enabled. When global is on, per-item markup fields become read-only and show the global value.

Update `LineItem` interface to include `markup: number` and `costPrice: number`.

### 2. Quote Preview with display toggles
**File: `src/components/job/QuoteTab.tsx`** (add Preview button) + **New file: `src/components/quote/QuotePreview.tsx`**

Add a "Preview Quote" button next to "Send Quote" in the action buttons area.

Opens a dialog showing the customer-facing quote with:
- **Three presets** at the top: "Detailed" | "Summary" | "Total Only"
- **Individual toggles** below: Show line items, Show quantities, Show unit prices, Show section breakdowns, Show markup/margin
- Preview renders in real-time based on toggles
- Shows: business name, customer name, address, date, cover letter text, then the line items (filtered by display settings), GST, total

### 3. Cover letter editor
**File: `src/components/job/QuoteTab.tsx`**

Add a "Cover Letter" collapsible section (like the existing Notes collapsible) above the sections. Contains:
- A dropdown to select from pre-built templates: "Professional", "Friendly", "Minimal"
- Selecting a template populates the textarea below
- Free-text editing with {{variable}} support
- Templates auto-fill `{{customer_name}}`, `{{business_name}}`, `{{quote_total}}`, `{{job_address}}`

### 4. Settings — new "Documents" tab
**File: `src/pages/SettingsPage.tsx`** + **`src/config/toolbarTabs.ts`**

Add a "Documents" tab to Settings with:
- **Quote Template**: Default cover letter template selection, company logo upload placeholder, terms & conditions textarea, default display preset (Detailed/Summary/Total Only)
- **Invoice Template**: Similar — default payment terms, bank details, notes
- **Default Markup**: Global default markup % that new quotes start with

Add the tab to `SETTINGS_EXTRAS` in toolbarTabs.

### 5. Summary card improvements
**File: `src/components/job/QuoteTab.tsx`**

Update the summary card to show:
- Cost total (before markup)
- Markup amount
- Subtotal (after markup)
- GST
- Grand total

This gives the tradie visibility into their margin at a glance.

## Files to create
- `src/components/quote/QuotePreview.tsx` — preview dialog with display toggles and presets
- `src/data/coverLetterTemplates.ts` — three pre-built cover letter templates

## Files to modify
- `src/components/job/QuoteTab.tsx` — two-line rows, markup field, cover letter, preview button, updated summary
- `src/pages/SettingsPage.tsx` — add Documents tab content
- `src/config/toolbarTabs.ts` — add Documents tab to SETTINGS_EXTRAS

