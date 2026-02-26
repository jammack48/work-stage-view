

## Plan: UX Improvements (6 changes)

### 1. Add text labels to mobile sidebar icons (PageToolbar.tsx)
**Lines 115-128**: Add a small label below each icon in the mobile vertical nav, matching the mobile horizontal bar style. Change icon-only buttons to include `<span className="text-[8px] font-medium leading-none">{label}</span>` and widen the nav from `w-16` to `w-[52px]` (compact but readable).

### 2. Fix Customer Card back button (CustomerCard.tsx)
**Line 215**: Change `navigate("/")` to `navigate("/customers")` so Back returns to the customer list, not the Pipeline.

### 3. Combine Theme Picker + Dark Mode into one dropdown (AppHeader.tsx + ThemePicker.tsx)
- **ThemePicker.tsx**: Add a dark/light mode toggle row inside the existing popover (below the colour swatches). Import `useTheme` already exists — add a Switch or simple toggle button for `isDark`.
- **AppHeader.tsx**: Remove the standalone Sun/Moon dark mode button (lines 52-54). The ThemePicker popover now handles both colour theme and dark mode. Also remove the LayoutGrid toolbar position cycler button (lines 42-50) — move that into Settings or remove entirely.

### 4. Remove redundant Pipeline heading buttons (Index.tsx)
**Lines 87-97**: Remove the `+ Customer`, `+ Quote`, `+ Invoice` buttons from the Pipeline Dashboard heading. The sidebar already has these. Also remove the `Lead >>> Paid` breadcrumb (lines 80-86). Keep just "Pipeline Dashboard" text and the layout toggle (desktop only).

### 5. Add "Manager Mode" label when in that view (Index.tsx)
**Line 76**: Instead of `undefined`, show a simple heading: `<span className="text-base font-bold text-card-foreground">Manager Mode</span>` so the user knows which view they're in.

### 6. Add "+" icon to Email and SMS sidebar labels (toolbarTabs.ts)
Update the Email and SMS tab labels to include a "+" hint — change labels from `"Email"` to `"Email +"` and `"SMS"` to `"SMS +"` to indicate these are template management + creation areas. Or better: keep labels short, add a `Plus` icon variant. Actually simplest: rename to `"Email Tpl"` and `"SMS Tpl"`.

