

## Make mail icon larger and more prominent on pipeline cards

**Problem:** The current mail icon on pipeline status cards is tiny (w-3 h-3) and hard to notice. Users need a clear, attention-grabbing indicator that a customer has replied, and tapping the mail icon should go to messages while tapping elsewhere on the card behaves normally.

**Changes:**

### 1. `src/components/StageColumn.tsx` — JobPreview component

- Increase the Mail icon from `w-3 h-3` to `w-5 h-5` with a coloured background pill (e.g. `bg-primary/20 rounded-full p-1`) so it stands out visually against the card colour.
- Move the Mail icon to its own row below the job name, separated from the text, so it has breathing room and is clearly tappable.
- Wrap the Mail icon in a clickable `<button>` with `e.stopPropagation()` that navigates to `/customers/:id?tab=messages` (or the appropriate messages route for that job).
- Keep the existing `animate-wiggle` animation — the larger size will make the vibration much more visible.

### 2. `src/components/StageColumn.tsx` — Color card click handlers

- No change needed to the card-level `onClick` — the mail button uses `stopPropagation` so tapping it won't trigger the normal card navigation.

### 3. `src/components/ManagerMode.tsx` — JobCard component

- Add a similar prominent Mail icon to the Manager Mode job card header area when `job.hasUnread` is true.
- Make it a tappable button that navigates to the customer messages view.
- Use the same large icon + wiggle animation treatment.

