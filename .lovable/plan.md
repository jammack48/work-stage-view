

## Simplify Navigation: Focused Page Toolbars + Dedicated Invoice Page

### Problem

Every page currently prepends 3 "common tabs" (Home, Customers, Schedule) before its own contextual tabs. This clutters the sidebar, especially on focused workspaces like Quote, Job Card, and Settings. The user wants each page to only show tabs relevant to its own task. If you need to go elsewhere, use the browser back button or the Home icon in the AppHeader.

Additionally, invoices currently route to `/job/new?stage=To+Invoice` which opens a generic Job Card. The user wants a dedicated Invoice page with a funnel flow similar to the Quote page (pick customer, add job details, choose follow-up sequence).

### Changes

#### 1. Remove common tabs from all non-home pages

**`src/config/toolbarTabs.ts`**

- Change `buildTabs()` to stop prepending `COMMON_TABS` — just return the extras directly
- Keep `COMMON_TABS` only for the Pipeline/Home page (`Index.tsx`)
- Remove `handleCommonTab` calls from all non-home pages since those tabs won't exist
- Add a single "Home" back-navigation tab as the first item in each non-home page's extras, so users can always get back

Resulting toolbar per page:
```text
Pipeline:    Home | Customers | Schedule | Bundles | Email | SMS | New Quote | Invoices | Settings
Quote:       ← Back | Overview | Line Items | Sequences | Notes | History
Job Card:    ← Back | Overview | History | Quote | Materials | Notes | Photos | Time | Forms | Invoice | Sequences
Invoice:     ← Back | Overview | Line Items | Sequences | Notes | History
Customers:   ← Back | Leads | Active | Archived
Customer:    ← Back | Overview | Jobs | Contacts | Notes | Spend | New Job
Settings:    ← Back | Business | Notifications | Appearance | Billing | Team | Integrations
Email:       ← Back | Quotes | Invoices | Reminders | Services | Reviews
SMS:         ← Back | Quotes | Invoices | Reminders | Services | Reviews
Schedule:    ← Back | Settings
Bundles:     ← Back | New Quote | Invoices | Settings
```

The "← Back" tab uses an `ArrowLeft` icon, navigates to `/` (home).

#### 2. Create dedicated Invoice page

**`src/pages/InvoicePage.tsx`** — Create

Mirrors the Quote page structure:
- Route: `/invoice/new` and `/invoice/:id`
- 3-step funnel for new invoices: Select Customer → Confirm Address → Define Job Details
- Post-funnel workspace with tabs: Overview, Line Items, Sequences, Notes, History
- Line Items tab reuses `QuoteTab` component (labour/materials/extras) repurposed for invoice line items
- Sequence selector at bottom (using `invoices` category pipelines)
- Status badge cycles: Draft → Sent → Paid

**`src/config/toolbarTabs.ts`** — Add `INVOICE_EXTRAS`

```typescript
export const INVOICE_EXTRAS: ToolbarTab[] = [
  { id: "back", label: "Back", icon: ArrowLeft },
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "line-items", label: "Line Items", icon: List },
  { id: "sequences", label: "Sequences", icon: Settings },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "history", label: "History", icon: History },
];
```

**`src/App.tsx`** — Add route `/invoice/:id`

**`src/pages/Index.tsx`** — Update "Invoices" navigation to go to `/invoice/new` instead of `/job/new?stage=To+Invoice`

#### 3. Update all page files to remove common tab handling

Files to update (remove `handleCommonTab` usage, use extras directly instead of `buildTabs`):
- `src/pages/QuotePage.tsx`
- `src/pages/JobCard.tsx`
- `src/pages/Customers.tsx`
- `src/pages/CustomerCard.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/BundlesPage.tsx`
- `src/pages/SchedulePage.tsx`
- `src/pages/EmailTemplatesPage.tsx`
- `src/pages/SmsTemplatesPage.tsx`

Each page:
- Adds a "Back" tab as first item (navigates home)
- Uses its own extras directly (no `buildTabs`)
- Removes `handleCommonTab` — the only special ID is "back" which navigates to `/`

#### 4. Update toolbarTabs.ts

- Add `ArrowLeft` import
- Add a `BACK_TAB` constant: `{ id: "back", label: "Back", icon: ArrowLeft }`
- Prepend `BACK_TAB` to every non-home extras array
- Update `buildTabs` to just prepend `BACK_TAB` for non-home pages
- Keep `COMMON_TABS` usage only in `Index.tsx`
- Update `handleCommonTab` route for `invoices` to `/invoice/new`

### Files Summary

| File | Action |
|------|--------|
| `src/config/toolbarTabs.ts` | Edit — add BACK_TAB, INVOICE_EXTRAS, simplify buildTabs |
| `src/pages/InvoicePage.tsx` | Create — dedicated invoice workspace with funnel |
| `src/App.tsx` | Edit — add `/invoice/:id` route |
| `src/pages/Index.tsx` | Edit — update invoice navigation path |
| `src/pages/QuotePage.tsx` | Edit — remove common tabs, use back + extras only |
| `src/pages/JobCard.tsx` | Edit — remove common tabs |
| `src/pages/Customers.tsx` | Edit — remove common tabs |
| `src/pages/CustomerCard.tsx` | Edit — remove common tabs |
| `src/pages/SettingsPage.tsx` | Edit — remove common tabs |
| `src/pages/BundlesPage.tsx` | Edit — remove common tabs |
| `src/pages/SchedulePage.tsx` | Edit — remove common tabs |
| `src/pages/EmailTemplatesPage.tsx` | Edit — remove common tabs |
| `src/pages/SmsTemplatesPage.tsx` | Edit — remove common tabs |

