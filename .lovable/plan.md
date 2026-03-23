

## Two Changes: Green Bubble Toggle + Schedule Job Dialog

### 1. Simple/Advanced Pipeline Toggle — Green Bubble Buttons

Currently the toggle uses a segmented control with `bg-primary` highlight. The user wants the selected mode to look like the Tutorial icon — a bold rounded green bubble with strong contrast.

**File: `src/pages/Index.tsx`** (lines 83-106)
- Replace the current muted segmented control with bold rounded-full buttons
- Active state: `bg-green-500 text-white font-bold shadow-md` (like the Tutorial bubble)
- Inactive state: `bg-secondary/50 text-muted-foreground`
- Slightly larger padding and rounded-full shape for a "pill bubble" look

### 2. Schedule Job — Staff & Date Picker Dialog (Fergus-style)

Currently, clicking a "Quote Accepted" job navigates to `/job/:id` which shows the overview. The "Schedule Job" label appears in the stage badge but there's no scheduling flow from here — it just goes to the existing schedule page with preloaded data.

The user wants: when you click "Schedule Job" (from the Quote Accepted stage in the pipeline), open a **dialog/popup** where you:
1. Select one or more staff members (checkboxes from STAFF list)
2. Pick a date (calendar date picker)
3. Confirm → job gets assigned and navigates to schedule or shows confirmation

**New File: `src/components/job/ScheduleJobDialog.tsx`**
- Dialog with two sections:
  - **Staff selection**: Multi-select checkboxes using the STAFF list from `scheduleData.ts` with color indicators
  - **Date picker**: Calendar component (already in UI library) to pick the scheduled day
  - **Time slot** (optional): Start time dropdown (7am-5pm)
- Confirm button creates the assignment and shows a toast
- This mirrors the Fergus workflow (images 97-98): select staff → select day → confirm

**File: `src/components/StageColumn.tsx`**
- For "Quote Accepted" stage, clicking a job card opens the ScheduleJobDialog instead of navigating directly to `/job/:id`

**File: `src/pages/QuotePage.tsx`**
- When status is "Approved" (Quote Accepted), add a "Schedule Job" button in the heading area
- Clicking it opens the ScheduleJobDialog

**File: `src/pages/JobCard.tsx`**
- For jobs in "Quote Accepted" stage, show a "Schedule Job" button in the heading
- Clicking it opens the ScheduleJobDialog

### Files Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Restyle Simple/Advanced toggle to bold green bubble buttons |
| `src/components/job/ScheduleJobDialog.tsx` | **New** — staff multi-select + calendar date picker dialog |
| `src/components/StageColumn.tsx` | Open ScheduleJobDialog for Quote Accepted stage clicks |
| `src/pages/QuotePage.tsx` | Add Schedule Job button for approved quotes |
| `src/pages/JobCard.tsx` | Add Schedule Job button for Quote Accepted jobs |

