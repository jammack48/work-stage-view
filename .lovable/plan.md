

## Feature: Bundles Management Page + Searchable Bundle Dropdown in Quote Funnel

### Overview

Two connected changes: (1) a dedicated Bundles page accessible from the Pipeline toolbar for browsing/creating bundle templates, and (2) replacing the bundle list in the Quote Funnel Step 3 with a searchable dropdown.

---

### 1. Add "Bundles" tab to Pipeline toolbar

**File: `src/pages/Index.tsx`**

- Add a `Package` icon import from lucide-react
- Add `{ id: "bundles", label: "Bundles", icon: Package }` to `HOME_TABS` array (after Pipeline, before Customers)
- In `handleTabChange`, add: `if (id === "bundles") { navigate("/bundles"); return; }`

**File: `src/App.tsx`**

- Add route: `<Route path="/bundles" element={<BundlesPage />} />`
- Import the new `BundlesPage` component

---

### 2. Create Bundles page — `src/pages/BundlesPage.tsx`

A standalone page using `PageToolbar` with its own tabs (Browse / Create). Reuses the same `BundleTemplate` type and `bundleTemplates` data.

**Browse tab:**
- Search bar at the top (filters by name/description)
- Card grid showing each bundle: name, description, icon, total price
- Clicking a bundle opens an expanded view showing its labour/materials/extras line items in collapsible sections (reusing the same pattern as `QuoteTab`)
- Each bundle card shows item counts per section

**Create tab:**
- Form to build a new bundle template: name, description
- Three collapsible sections (Labour, Materials, Extras) with the same catalogue search/add pattern from `QuoteTab`
- "Save Bundle" button (local state only, adds to list)

**Page heading:** "Bundle Templates" with a count badge

**Layout:** Uses `PageToolbar` with `pageHeading` prop, consistent with all other pages.

---

### 3. Searchable bundle dropdown in Quote Funnel Step 3

**File: `src/components/quote/QuoteFunnel.tsx`** — `StepBundle` component

Replace the current flat list of bundle buttons with:

- Keep the "Custom Job" card at the top (unchanged)
- Replace the "or choose a bundle" divider + button list with a **searchable dropdown** using the existing `Command` component (combobox pattern):
  - A trigger button showing "Select a bundle..." or the selected bundle name
  - A `Popover` containing `Command` with `CommandInput` for type-to-search
  - `CommandList` showing filtered `bundleTemplates` with name, description snippet, and price
  - Selecting a bundle calls `onSelectBundle(b)` immediately
- This keeps the UI clean and scalable as bundle count grows

---

### Technical Details

- **Data:** Uses existing `bundleTemplates` and `BundleTemplate` from `src/data/dummyJobDetails.ts`. New bundles created on the Bundles page are stored in React state (no persistence).
- **Components reused:** `PageToolbar`, `Command`/`CommandInput`/`CommandList`/`CommandItem`, `Collapsible`, `Input`, `Button`, `Card`
- **Icons:** `Package` for the toolbar tab and page, existing `BUNDLE_ICONS` map for individual bundles
- **Routing:** New route `/bundles` added to `App.tsx`

### Files Changed

| File | Change |
|------|--------|
| `src/pages/BundlesPage.tsx` | New — Bundles browse/create page |
| `src/pages/Index.tsx` | Add "Bundles" tab to `HOME_TABS`, handle navigation |
| `src/App.tsx` | Add `/bundles` route |
| `src/components/quote/QuoteFunnel.tsx` | Replace bundle list in Step 3 with searchable `Command` dropdown |

