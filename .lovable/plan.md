

## Fix: Action Buttons Overflow Off Screen

The "Arrived on Site" and "Finish & Invoice" / "Finished Job" buttons use `flex-1` with `text-base font-bold` and long labels, causing the second button to overflow off the right edge on narrow screens (visible in screenshot).

### Fix in `src/components/job/WorkJobCard.tsx`

**Change the action buttons container and button styles:**
- Add `min-w-0` to each button so `flex-1` can shrink below content size
- Reduce text size to `text-sm` on the buttons
- Add `truncate` to prevent text from forcing overflow
- Reduce icon size from `w-5 h-5` to `w-4 h-4`

The fix is purely CSS — change line 165's button container and the button classes on lines 169, 177, 185 to use `text-sm` and `min-w-0`, and shrink the icons.

