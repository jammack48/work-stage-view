

## Fix mail icon click and make it blue

**Problem:** The mail icon button's click is being swallowed by the `LeadActionMenu` wrapper (Popover/Drawer) on Lead stage cards. Even on non-Lead stages, the card's `onClick` or wrapping `TutorialTip` may intercept the event. Also, the icon needs to be bright blue like the tutorial icon for better visibility.

**Changes:**

### 1. `src/components/StageColumn.tsx` — JobPreview mail button

- Make the mail icon and "Reply waiting" text use a bright blue color (`text-blue-400` or similar) instead of `text-primary` so it pops against all card backgrounds.
- Increase icon size to `w-5 h-5` for better tap target.
- Add `z-10 relative` to the button so it sits above any wrapper overlays.
- Add both `e.stopPropagation()` and `e.preventDefault()` to ensure no parent handler (LeadActionMenu popover trigger, card onClick) intercepts the tap.

### 2. `src/components/StageColumn.tsx` — Color card rendering

- For Lead stage cards that have unread messages, avoid wrapping in `LeadActionMenu` — instead render the card with `TutorialTip` like other stages, so the mail button's `stopPropagation` works correctly. The LeadActionMenu should only trigger when clicking the card area outside the mail button. This can be done by moving the LeadActionMenu trigger to the card's own onClick (when no unread) or restructuring so the mail button isn't inside the popover trigger.
- Alternatively, a simpler fix: render both — keep LeadActionMenu but ensure the mail `<button>` uses `onPointerDown` with `stopPropagation` to prevent the Radix popover from capturing the event before the click fires.

### 3. `src/components/ManagerMode.tsx` — Same blue styling

- Update the mail icon button to use bright blue (`text-blue-400`) with matching glow for consistency.

