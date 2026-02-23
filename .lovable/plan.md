

## Uniform Layout: Same Header + Page Heading on Every Screen

### Problem
Right now, the Pipeline page shows "Toolbelt" branding in the header, but the Job Card page shows "Hot Water Cylinder..." with a back arrow instead -- a completely different header (JobTopStrip). There is no consistent page heading line across screens. The layout feels inconsistent page-to-page.

### Solution
Every screen will follow this structure from top to bottom:

```text
+--------------------------------------------------+
| [Wrench] Toolbelt         [Customers] [Settings]  |  <-- AppHeader (identical on ALL pages)
|                           [Theme] [Dark/Light]     |
+--------------------------------------------------+
| Page Heading: "Pipeline Dashboard  Lead >>> Paid"  |  <-- New: Page Heading Bar
+--------------------------------------------------+
| [Home] [Tab1] [Tab2] ...         [Position Toggle] |  <-- Movable Toolbar (if top position)
+--------------------------------------------------+
| Content area                                       |
+--------------------------------------------------+
```

If the toolbar is at top, it sits between the page heading and the content. If the toolbar is on the side, the page heading spans the full width above the content.

### Changes

**1. AppHeader stays the same on ALL pages** (`src/components/AppHeader.tsx`)
- Remove the `title` prop override -- it always says "Toolbelt"
- Remove `showBack` / `backTo` props -- no back arrow in the header (that's what the Home button in the toolbar is for)
- Keep right-side icons: Customers, Settings, ThemePicker, Dark/Light toggle

**2. Replace JobTopStrip with AppHeader** (`src/pages/JobCard.tsx`)
- Stop using JobTopStrip entirely
- Use AppHeader (same as every other page)
- The job name, value, and status move into the page heading bar instead

**3. Add `pageHeading` prop to PageToolbar** (`src/components/PageToolbar.tsx`)
- New optional prop: `pageHeading: React.ReactNode`
- Renders a heading bar between the AppHeader and the toolbar/content
- The heading bar always appears at the top of the PageToolbar area, regardless of toolbar position
- If toolbar is at top, the heading bar is above the toolbar; if toolbar is on the side/bottom, it still appears at the top of the content area

**4. Each page provides its page heading:**
- **Index (Pipeline):** "Pipeline Dashboard" with Lead >>> Paid indicator (move existing heading into `pageHeading` prop)
- **Customers:** "Customer Directory"
- **CustomerCard:** Customer name (e.g., "Dave Thompson")
- **JobCard:** Job name + value + status badge (e.g., "Hot Water Cylinder Replace -- $500 -- Lead")
- **Settings:** "Settings"

**5. Remove JobTopStrip component** (`src/components/job/JobTopStrip.tsx`)
- No longer needed since all pages use AppHeader + page heading

### Files to modify
- `src/components/AppHeader.tsx` -- simplify: always "Toolbelt", remove back/title overrides
- `src/components/PageToolbar.tsx` -- add `pageHeading` prop, render heading bar above toolbar/content
- `src/pages/Index.tsx` -- pass pipeline heading as `pageHeading` prop
- `src/pages/JobCard.tsx` -- use AppHeader, pass job info as `pageHeading`
- `src/pages/Customers.tsx` -- pass "Customer Directory" as `pageHeading`
- `src/pages/CustomerCard.tsx` -- pass customer name as `pageHeading`
- `src/pages/SettingsPage.tsx` -- pass "Settings" as `pageHeading`

### Result
- Every page has the same "Toolbelt" header with identical right-side icons
- Every page has a descriptive heading bar below the header saying what the page is about
- The movable toolbar only contains page-specific tabs + the Home button + the position toggle
- Completely uniform layout across all screens
