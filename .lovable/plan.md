
# Theme Switcher — 5 Color Themes + Dark/Light Mode

## What's Being Built

A global theme system with 5 distinct color themes (matching the Shortwave-inspired aesthetic), surfaced as a compact "three-bar riser" indicator button next to the dark mode toggle in the app header. Themes work independently of dark/light mode — any theme can be used in either.

## The 5 Themes

| Name | Accent Color | Feel |
|---|---|---|
| Earthy (current default) | Sage green | Warm muted naturals |
| Ocean | Shortwave blue | Deep navy + electric blue |
| Ember | Amber/Orange | Warm glow, fire tones |
| Rose | Dusty rose/red | Soft terracotta, pink accent |
| Slate | Cool grey/purple | Clean, minimal, corporate |

## UI — Theme Picker in Header

Next to the dark/light toggle, a small button that looks like three vertical bars at different heights (like an equaliser/riser). Clicking it opens a compact popover with 5 theme swatches (colour circles), the active one highlighted with a ring.

```text
Header right side:
[Pipeline] [Customers] [Settings]  [|||] [☀]
                                     ↑
                              Three-riser icon
                              (opens popover with 5 colour dots)
```

## Architecture

### 1. Global Theme Context — NEW FILE: `src/contexts/ThemeContext.tsx`

Stores `theme` and `isDark` state globally so all pages share the same values. Persists to `localStorage` so preference is remembered across navigation.

```ts
type Theme = "earthy" | "ocean" | "ember" | "rose" | "slate";
// Provides: theme, setTheme, isDark, setIsDark
```

### 2. CSS Variables — `src/index.css`

Add data-attribute theme blocks alongside the existing `.light` class. The `[data-theme="ocean"]` block overrides the primary/accent/stage hues:

```css
[data-theme="ocean"] {
  --primary: 215 80% 55%;
  --background: 220 25% 10%;
  /* ...etc */
}
[data-theme="ocean"].light {
  --background: 215 30% 93%;
  /* ...etc */
}
```

Applied to `document.documentElement` as both a `data-theme` attribute and class toggle for `light`.

### 3. Theme Picker Component — NEW FILE: `src/components/ThemePicker.tsx`

A small button (`|||` three-riser SVG icon) that opens a `Popover` with 5 colour dot swatches. Clicking a swatch applies that theme instantly.

### 4. AppHeader Update — `src/components/AppHeader.tsx`

- Remove `isDark` / `onToggleDark` props (now comes from context via `useTheme()`)
- Import and place `<ThemePicker />` between the Settings nav button and the dark mode toggle
- All pages using `AppHeader` stop passing the dark/isDark props

### 5. Pages Updated (prop cleanup)

All pages that currently manage their own `isDark` local state get simplified:
- `src/pages/Index.tsx`
- `src/pages/Customers.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/CustomerCard.tsx`
- `src/pages/JobCard.tsx`

Local `isDark` state and `useEffect` for class toggling are removed — the context handles it.

### 6. `src/App.tsx`

Wrap everything in `<ThemeProvider>` (inside the existing providers).

## Technical Details

### Theme CSS variable strategy

Each theme only overrides the key hue variables — backgrounds, cards, primary, accent, stage-header. The `.light` modifier is still toggled as a class on `<html>`. Both can stack: `<html data-theme="ocean" class="light">`.

CSS specificity order:
```text
:root → base dark defaults
[data-theme="ocean"] → ocean dark overrides  
.light → light overrides
[data-theme="ocean"].light → ocean light overrides (highest specificity)
```

### The three-riser icon

A tiny inline SVG of 3 vertical bars at heights 40%, 70%, 55% — no external icon library needed. Gives a clear "themes/appearance" affordance without using the existing Settings gear.

### Files changed summary

| File | Action |
|---|---|
| `src/contexts/ThemeContext.tsx` | CREATE — global theme + dark state |
| `src/components/ThemePicker.tsx` | CREATE — popover with 5 theme swatches |
| `src/index.css` | EDIT — add 4 new theme variable blocks |
| `src/components/AppHeader.tsx` | EDIT — add ThemePicker, remove prop drilling |
| `src/App.tsx` | EDIT — wrap with ThemeProvider |
| `src/pages/Index.tsx` | EDIT — remove local isDark state |
| `src/pages/Customers.tsx` | EDIT — remove local isDark state |
| `src/pages/SettingsPage.tsx` | EDIT — remove local isDark state |
| `src/pages/CustomerCard.tsx` | EDIT — remove local isDark state |
| `src/pages/JobCard.tsx` | EDIT — remove local isDark state (if present) |
