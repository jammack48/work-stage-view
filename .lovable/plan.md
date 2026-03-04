

## Fix schedule horizontal drag issue on mobile

### Problem
Both Day and Week views on mobile allow the entire screen to be dragged sideways. In Week view, `TimeGridDesktop` has `overflow-x-auto` and `min-w-[700px]` which creates a wide scrollable area that drags the whole page. In Day view, the parent containers may allow horizontal overflow.

### Solution

**1. `src/components/schedule/TimeGridDesktop.tsx` — Make week view fit mobile screens**
- Remove `min-w-[700px]` when used on mobile (accept an `isMobile` prop or make columns responsive)
- Remove `overflow-x-auto` wrapper — force 7 columns to fit within available width
- Use `overflow-hidden` instead to prevent any horizontal scroll
- Make job cards more compact at narrow widths (already has `compact` prop)

**2. `src/components/schedule/TimeGridMobile.tsx` — Prevent page-level horizontal drag**
- Add `overscroll-behavior-x: none` and `touch-action: pan-y` to the container to prevent the browser from doing a horizontal page scroll during swipe gestures
- Ensure the outer scrollable wrapper in WorkHome/SchedulePage also has `overflow-x-hidden`

**3. `src/pages/WorkHome.tsx` — Lock horizontal overflow on the scroll container**
- Add `overflow-x-hidden` to the scrollable time grid wrapper div (line 143-144) so swiping left/right on the day grid never causes page-level movement

**4. `src/pages/SchedulePage.tsx` — Same overflow lock**
- Add `overflow-x-hidden` to the mobile scroll wrapper (line 182)

### Files changed
1. `src/components/schedule/TimeGridDesktop.tsx` — remove min-width/overflow-x-auto, fit to screen
2. `src/components/schedule/TimeGridMobile.tsx` — add overscroll-behavior-x: none
3. `src/pages/WorkHome.tsx` — overflow-x-hidden on scroll container
4. `src/pages/SchedulePage.tsx` — overflow-x-hidden on scroll container

