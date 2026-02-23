

## Visual Polish: Column Contrast, Card Depth, Header Hierarchy, and Sidebar Icons

Four targeted improvements based on the UX review, skipping the attention strip.

### 1. Column Contrast -- Subtle tint wash on pipeline columns

Currently columns use `hsl(210 40% 50% / 0.25)` which works but blends into the background on some themes. Increase the opacity slightly and make it theme-aware so each theme's columns feel distinct.

- **File:** `src/components/StageColumn.tsx`
- Change the inline `backgroundColor` from `hsl(210 40% 50% / 0.25)` to use a new CSS variable `--column-bg`
- **File:** `src/index.css`
- Add `--column-bg` to each theme with a subtle 8-12% tint that complements the theme (earthy warm wash for Earthy, cool blue for Ocean, etc.)

### 2. Card Depth -- Shadow, border, and elevation on status cards

The green/orange/red status cards inside each column feel flat. Add soft shadow and a subtle border to improve "clickable affordance."

- **File:** `src/components/StageColumn.tsx`
- Add `shadow-sm border border-white/10` to each status card div
- Add `hover:shadow-md transition-shadow` for interactive feel
- The column container itself also gets a subtle `shadow-sm`

### 3. Header Hierarchy -- Lighten header, strengthen cards

The AppHeader currently uses `bg-card` which competes visually with the job cards. Make the header recede so the eye goes to jobs first.

- **File:** `src/components/AppHeader.tsx`
- Change header from `bg-card` to `bg-background` (or a new subtle variable) so it's lighter/less prominent
- Reduce text weight: title from `font-bold` to `font-semibold`, reduce size slightly
- **File:** `src/components/PageToolbar.tsx`
- Similarly, the page heading bar uses `bg-card` -- change to `bg-background` to match the lighter header

### 4. Sidebar Icons -- Bigger, bolder, more contrast

The movable toolbar icons (especially on mobile vertical sidebar) are too small and low contrast for trades use.

- **File:** `src/components/PageToolbar.tsx`
- Mobile vertical: increase icon button size from `w-11 h-11` to `w-12 h-12`, icon from `w-5 h-5` to `w-6 h-6`
- Increase sidebar width from `w-14` to `w-16` to accommodate
- Active tab: already uses `bg-primary` which is good -- ensure inactive icons use `text-foreground/70` instead of `text-muted-foreground` for better contrast
- Desktop vertical: similar sizing bump for icons

### Technical details

**Files to modify:**
- `src/index.css` -- add `--column-bg` variable to all themes (root, light, ocean, ember, rose, slate)
- `src/components/StageColumn.tsx` -- use `--column-bg` variable, add shadow/border to status cards
- `src/components/AppHeader.tsx` -- lighten header background
- `src/components/PageToolbar.tsx` -- lighten heading bar, increase sidebar icon sizes

**No new dependencies needed. No structural changes -- purely visual refinements.**

