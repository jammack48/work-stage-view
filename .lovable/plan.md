

## Two Issues to Fix

### 1. Desktop: `scale-110` causes layout jump
The `scale-110` on the selected day button causes the entire strip to shift vertically when selection changes because it physically enlarges the element, pushing surrounding content. Fix: remove `scale-110` and use visual-only effects (shadow, ring, background) that don't affect layout flow.

### 2. Mobile: Swipe left/right should change day
Currently mobile has no swipe gesture on the time grid. Add swipe detection to `TimeGridMobile` so swiping left goes to next day and swiping right goes to previous day.

### Changes

**`src/components/schedule/DayStrip.tsx`** (line 32)
- Remove `scale-110` from selected state to prevent layout jump
- Keep all other visual indicators (bg-primary, ring, shadow, border)

**`src/components/schedule/TimeGridMobile.tsx`**
- Add touch swipe detection (onTouchStart/onTouchEnd)
- Swipe left → next day (increment dayOffset, max 4)
- Swipe right → prev day (decrement dayOffset, min 0)
- Requires new `onDayChange` callback prop

**`src/pages/SchedulePage.tsx`**
- Pass `onDayChange={setSelectedDay}` to `TimeGridMobile`

| File | Change |
|------|--------|
| `src/components/schedule/DayStrip.tsx` | Remove `scale-110` from selected styling |
| `src/components/schedule/TimeGridMobile.tsx` | Add swipe gesture to change day |
| `src/pages/SchedulePage.tsx` | Pass `onDayChange` to TimeGridMobile |

