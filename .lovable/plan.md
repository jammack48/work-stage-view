

## Problem

Currently only Pipeline, Schedule, and Bundles pages use the shared `COMMON_TABS` (Pipeline, Customers, Schedule). The other pages — **QuotePage**, **Customers**, **CustomerCard**, **JobCard**, and **SettingsPage** — each define their own isolated tab arrays with no common navigation. This means once you navigate into a quote, job, or customer page, you lose the familiar core navigation buttons.

## Solution

Every page's toolbar will show the **same core tabs first** (Pipeline, Customers, Schedule), followed by that page's own contextual tabs. The `handleCommonTab` function already handles routing for the core tabs — each page just needs to prepend `COMMON_TABS` and wire up the handler.

Additionally, the Home button in `PageToolbar` currently hardcodes navigation to `/pipeline`. Per the user's request, the Home button should go to `/pipeline` (the main dashboard), which it already does — this is correct.

## Changes

### 1. `src/config/toolbarTabs.ts` — Add extras for remaining pages

Add new extras arrays for Quote, Job, Customer, CustomerCard, and Settings pages so each page can do `buildTabs(...PAGE_EXTRAS)`.

### 2. `src/pages/QuotePage.tsx`

- Import `buildTabs`, `handleCommonTab` from `@/config/toolbarTabs`
- Replace `QUOTE_TABS` with `buildTabs(...QUOTE_EXTRAS)` where `QUOTE_EXTRAS` contains the page-specific tabs (Overview, Line Items, Notes, History)
- Add `handleCommonTab(id, navigate)` check in `onTabChange` before handling local tabs

### 3. `src/pages/Customers.tsx`

- Import `buildTabs`, `handleCommonTab`
- Current tabs (All, Leads, Active, Archived) become extras after the common tabs
- Wire up `handleCommonTab` in `onTabChange`

### 4. `src/pages/CustomerCard.tsx`

- Import `buildTabs`, `handleCommonTab`
- Current tabs (Overview, Jobs, Contacts, Notes, Spend, New Job) become extras
- Wire up `handleCommonTab` in `onTabChange`

### 5. `src/pages/JobCard.tsx`

- Import `buildTabs`, `handleCommonTab`
- Current tabs (Overview, History, Quote, Materials, etc.) become extras
- Wire up `handleCommonTab` in `onTabChange`

### 6. `src/pages/SettingsPage.tsx`

- Import `buildTabs`, `handleCommonTab`
- Current tabs (Business, Notifications, etc.) become extras
- Wire up `handleCommonTab` in `onTabChange`

### Pattern for each page

Every page follows the same pattern:

```typescript
import { buildTabs, handleCommonTab } from "@/config/toolbarTabs";

const PAGE_EXTRAS = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  // ... page-specific tabs
];

const PAGE_TABS = buildTabs(...PAGE_EXTRAS);

// In component:
const handleTabChange = (id: string) => {
  if (handleCommonTab(id, navigate)) return;
  setActiveTab(id as LocalTabType);
};
```

### Files changed

| File | Change |
|------|--------|
| `src/config/toolbarTabs.ts` | Add QUOTE_EXTRAS, JOB_EXTRAS, CUSTOMER_LIST_EXTRAS, CUSTOMER_CARD_EXTRAS, SETTINGS_EXTRAS |
| `src/pages/QuotePage.tsx` | Prepend common tabs, add handleCommonTab |
| `src/pages/Customers.tsx` | Prepend common tabs, add handleCommonTab |
| `src/pages/CustomerCard.tsx` | Prepend common tabs, add handleCommonTab |
| `src/pages/JobCard.tsx` | Prepend common tabs, add handleCommonTab |
| `src/pages/SettingsPage.tsx` | Prepend common tabs, add handleCommonTab |

