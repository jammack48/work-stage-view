

## Mobile-First Audit and Fix Plan

The uploaded screenshot shows the mobile pipeline view has significant usability issues: cramped layout, hard-to-read text, poor touch targets, and the sidebar + header take up too much space. The core promise is "run your business from the toilet" so mobile must feel native-app quality.

### Issues Identified

1. **Pipeline carousel cards too narrow** -- 85% width with max-width 320px clips stage columns, making color cards hard to tap
2. **AppHeader wastes vertical space on mobile** -- full-width header with multiple buttons eats into content area
3. **PageToolbar mobile sidebar (w-16) too wide** for icon-only nav, and horizontal bar items too small
4. **ExpandedStagePanel grid columns don't adapt** -- uses `grid-cols-[auto_1fr_60px]` which cramps on small screens
5. **LeadActionMenu popover may overflow** on small screens -- needs mobile-aware positioning
6. **StageColumn color cards fixed 72px height** -- fine but text inside truncates aggressively on mobile
7. **Customer list hides email/address on mobile** (already handled) but phone numbers truncate
8. **Schedule DayStrip px-4 padding too tight** on small phones
9. **ManagerMode swipe cards not optimized** for thumb reach -- action buttons small
10. **TutorialBanner takes vertical space** on mobile where screen real estate is precious
11. **No safe-area-inset handling** for notched phones (only partial on bottom bar)

### Implementation Steps

#### 1. Compact AppHeader on mobile
- Reduce padding to `px-3 py-2` on mobile
- Hide "Tradie Toolbelt" text on very small screens (< 360px), show only wrench icon
- Make header buttons `h-8 w-8` minimum touch targets (already close but verify)

#### 2. Optimize mobile pipeline carousel
- Increase carousel item width from `85%` to `90%` for better card visibility
- Remove `max-w-[320px]` constraint -- let cards fill available space
- Make nav dots bigger (w-2.5 h-2.5) for easier tap targeting
- Add haptic-style visual feedback on slide change

#### 3. Improve StageColumn mobile rendering
- Increase color card height from `72px` to `78px` on mobile for better readability
- Ensure job preview text doesn't truncate the client name
- Make the entire color card a bigger touch target with `min-h-[68px]`

#### 4. Mobile-optimized ExpandedStagePanel
- On mobile, switch to a simpler list layout: single column with client name, age badge, and status dot
- Remove the column headers row on mobile (they take space and aren't needed for a simple list)
- Make each job row taller (`min-h-[52px]`) for thumb-friendly tapping

#### 5. LeadActionMenu mobile adaptation
- On mobile, render as a bottom drawer (vaul Drawer) instead of a Popover
- Full-width action buttons with larger icons for thumb reach
- Add the customer name prominently at the top

#### 6. PageToolbar mobile improvements
- Mobile sidebar (position=left/right): increase icon size, add better active state glow
- Mobile bottom bar: ensure `min-h-[52px]` for each tab and proper safe-area padding
- Scrollable toolbar with visual fade edges to indicate more tabs

#### 7. ManagerMode mobile optimization
- Stage picker pills: increase `min-h-[36px]` and `px-4` for better tap targets
- Priority filter buttons: ensure `min-h-[44px]`
- Job cards in swipe mode: increase action button height to `h-12`
- Note textarea: ensure it's not hidden behind keyboard (scroll into view)

#### 8. Schedule page mobile fixes
- DayStrip: increase button size to `min-w-[56px]` and font sizes
- TimeGridMobile: ensure job cards have adequate touch targets

#### 9. Customer pages mobile polish
- Customer list cards: increase row height, show email as secondary line on mobile instead of hiding
- CustomerCard overview: ensure grid cards don't overflow on small screens

#### 10. Global mobile CSS enhancements
- Add `-webkit-tap-highlight-color: transparent` globally
- Add `touch-action: manipulation` on interactive elements to remove 300ms tap delay
- Ensure `safe-area-inset-bottom` is respected on all fixed bottom elements
- Add CSS for `.safe-area-pb` utility class if missing

### Technical Details

**Files to modify:**
- `src/components/AppHeader.tsx` -- compact mobile header
- `src/pages/Index.tsx` -- carousel sizing, dot size
- `src/components/StageColumn.tsx` -- mobile card heights, touch targets
- `src/components/ExpandedStagePanel.tsx` -- simplified mobile list
- `src/components/LeadActionMenu.tsx` -- drawer on mobile, popover on desktop
- `src/components/PageToolbar.tsx` -- larger mobile nav items, safe areas
- `src/components/ManagerMode.tsx` -- bigger touch targets
- `src/components/schedule/DayStrip.tsx` -- larger day buttons
- `src/components/schedule/TimeGridMobile.tsx` -- touch target sizes
- `src/pages/Customers.tsx` -- mobile row layout
- `src/pages/CustomerCard.tsx` -- responsive grid
- `src/index.css` -- global mobile utilities (tap highlight, safe areas)
- `src/components/TutorialBanner.tsx` -- compact on mobile

