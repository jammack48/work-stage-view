

## Fix Duplicate Home Icons and Restyle Header

### Problem
1. Two Home icons appear in the movable toolbar -- one from PageToolbar's built-in Home button, and one from the "Pipeline" tab (which uses the Home icon) on the Index page
2. The top-right header buttons (Customers, Settings, Theme, Dark mode) look different from the movable toolbar icons
3. No Home icon on the left side of the header

### Changes

**1. Remove Home button from PageToolbar** (`src/components/PageToolbar.tsx`)
- Delete the `homeBtn` function entirely -- it's redundant since each page already defines its own tabs (and the Index page has a Pipeline/Home tab)
- Remove all `{homeBtn()}` and `{homeBtn(true)}` calls from every layout variant
- The movable toolbar will only show the page's defined tabs plus the position-cycle toggle

**2. Add Home icon to AppHeader left side** (`src/components/AppHeader.tsx`)
- Add a Home icon button to the left of the Wrench/Toolbelt branding that navigates to `/`
- Move the Wrench icon and "Toolbelt" text slightly right to give it space

**3. Restyle top-right header icons to match toolbar** (`src/components/AppHeader.tsx`)
- Change Customers, Settings, ThemePicker, and dark/light toggle to icon-only buttons (no text labels) with consistent sizing (`w-9 h-9` or `w-8 h-8`)
- Match the rounded-lg, muted-foreground hover style used in the movable toolbar
- Remove the text labels ("Customers", "Settings") so the icons are uniform

**4. Change Pipeline tab icon** (`src/pages/Index.tsx`)
- Change the Pipeline tab from the `Home` icon to `Columns` (or similar) so it doesn't look like a second Home button -- since the header now has the Home navigation

### Result
- One Home icon in the top-left of the header (consistent across all pages)
- Movable toolbar only shows page-specific tabs plus the position toggle
- Top-right header icons match the toolbar's icon-only style
- No duplicate Home icons anywhere

### Technical Details

Files to modify:
- `src/components/PageToolbar.tsx` -- remove homeBtn and all references
- `src/components/AppHeader.tsx` -- add Home icon left side, restyle right-side icons to icon-only
- `src/pages/Index.tsx` -- change Pipeline tab icon from `Home` to `Columns`
- `src/components/job/JobTopStrip.tsx` -- ensure the Job Card header also has consistent Home icon on left

