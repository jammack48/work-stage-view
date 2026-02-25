

## Changes Required

### 1. Fix the Quotes tab icon and make it navigate to `/quote/new`

**File: `src/pages/Index.tsx`**

The `$` (DollarSign) icon in the sidebar represents "Quotes" but does nothing when clicked — `handleTabChange` only handles `customers` and `settings`, so clicking "quotes" just sets `activeView` to `"quotes"` with no visible effect.

Changes:
- Replace `DollarSign` icon with `FilePlus` (or `Plus` wrapped with `FileText`) to indicate "New Quote" — a plus icon makes the action clearer
- In `handleTabChange`, add: `if (id === "quotes") { navigate("/quote/new"); return; }`
- Similarly for invoices: `if (id === "invoices") { navigate("/job/new?stage=To+Invoice"); return; }`

### 2. Home button should navigate to `/pipeline` (not `/`)

**File: `src/components/PageToolbar.tsx`**

The Home button in the PageToolbar currently navigates to `/` (the Hub). On sub-pages like `/job/:id` or `/quote/new`, clicking Home should take users back to the pipeline dashboard at `/pipeline`, since that is the operational home for job management.

Change: Update the Home button's `navigate("/")` to `navigate("/pipeline")`.

### 3. Rename branding on Hub page

**File: `src/pages/Hub.tsx`**

- Change heading from "Your Control Panel" to "Your Dashboard"
- Change app name reference to "Tradie Toolbelt" (the AppHeader already says "Toolbelt" — keep that consistent)
- Update tagline to "Run your entire trade business from one place." (already correct)

### 4. Rename in AppHeader

**File: `src/components/AppHeader.tsx`**

- Change the header text from "Toolbelt" to "Tradie Toolbelt"

### Summary

Four small edits across four files:
- Quotes tab navigates to `/quote/new` with a more descriptive icon
- Invoices tab navigates to `/job/new?stage=To+Invoice`
- Home button in PageToolbar goes to `/pipeline`
- Hub heading changed to "Your Dashboard", app name to "Tradie Toolbelt"

