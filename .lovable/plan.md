

## Two changes to JobCompletionFlow

### 1. Lighten all textareas/inputs in the completion dialog

The textarea on the Job Sheet step (and others like return note) uses default styling which is too dark in the earthy theme. Change all `Textarea` instances in `JobCompletionFlow.tsx` to use `bg-background border-border` class for a clearly lighter, distinct field. Same for `Input` fields in the flow.

### 2. Add quick-select common phrases on Job Sheet step

Add a list of checkbox-style quick phrases above the textarea on the "jobsheet" step. When tapped, the phrase appends to the job sheet text. Common tradie phrases:

- Arrived on site
- Spoke with customer
- Diagnosed fault
- Tested and commissioned
- Cleaned up site
- Left materials on site
- Isolated power/water
- Work completed as quoted

Each phrase is a tappable chip/badge. Tapping toggles it on (appends text) or off (removes text).

**File:** `src/components/job/JobCompletionFlow.tsx`

- Lines 184-188: Replace jobsheet step content with quick-phrase chips + lighter textarea
- Add `className="bg-background border-border"` to all Textarea/Input instances in the file (lines 177, 187, 200, 266, 402)

