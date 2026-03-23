

## Fix Stage Header Truncation + Quote Sent Navigation

### Two Issues

**1. Stage column headers truncate with "..." when screen is compressed**
Currently the header text uses `truncate` (line 182 in StageColumn.tsx), causing labels like "Pricing/Quoting" to show as "Pricing/Q...". Headers should wrap to a second line instead.

**2. Clicking into "Quote Sent" (Awaiting Acceptance) stage opens the quote builder/send flow instead of showing the sent quote with Accept/Decline buttons**
The QuotePage always starts with `status: "Draft"` (line 56). For jobs in "Quote Sent" stage, the status should initialize as "Sent" so the page shows the sent quote preview with Accept/Decline buttons — like Fergus does — instead of the quote editor.

### Changes

**File: `src/components/StageColumn.tsx`**
- Line 182: Remove `truncate` class from the stage label `<div>`, replace with `break-words` or allow natural text wrapping
- Line 175: Remove the fixed `h-[52px]` height constraint on the header so it can grow when text wraps
- Use `min-h-[52px]` instead to maintain minimum size but allow expansion

**File: `src/pages/QuotePage.tsx`**
- Line 56: Instead of always defaulting to `"Draft"`, derive the initial status from the job's current stage:
  - If job stage is `"Quote Sent"` → initial status = `"Sent"`
  - If job stage is `"Quote Accepted"` → initial status = `"Approved"`
  - Otherwise → `"Draft"`
- Line 54: When status is "Sent", default the initial tab to `"overview"` or a new preview-focused view instead of `"line-items"` — so the user sees what was sent (the quote preview) with Accept/Decline buttons, not the editable quote builder
- Add Accept and Decline action buttons visible when status is "Sent":
  - **Accept**: updates job stage to "Quote Accepted", sets status to "Approved", shows toast
  - **Decline**: navigates back or shows confirmation, could set a "Declined" local state
- These buttons appear prominently at the top of the quote content area (similar to Fergus's green "Accept" / red "Decline" bar)

### Result
- Column headers wrap cleanly on compressed screens — full text always visible
- Clicking a "Quote Sent" job opens a read-only view showing the sent quote with Accept/Decline actions, matching the Fergus workflow

