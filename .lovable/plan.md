

## Replace Inline Calendar with Schedule Page Navigation + Book Later Option

### Problem
The "Coming Back" flow currently shows a small inline calendar date picker. The user wants it to navigate to the **actual Schedule page** (with time grid, day strip, staff view) so they can properly slot the return visit. After scheduling, they should return to the close-out flow. They also want a **"Book Later"** option for when they can't schedule right now (e.g. waiting on parts availability).

### Changes

#### `src/components/job/SoleTraderCloseOutFlow.tsx`
- Remove the `Popover`/`Calendar` date picker, `calendarOpen` state, and `returnDate` state
- Remove `Calendar` and `Popover` imports
- Replace with two buttons in the "Coming Back" section:
  1. **"Open Schedule"** — navigates to `/schedule?returnJob={jobId}` using `useNavigate()`. This closes the dialog and takes the user to the full schedule page where they can book the slot properly. After they're done on the schedule page, they use normal back navigation to return to the pipeline.
  2. **"Book Later"** — closes the flow immediately with a toast saying "Return visit saved — schedule when ready". Saves the return note but skips scheduling entirely.
- Update `handleEarlyClose` to accept a "booked" vs "later" mode for different toast messages
- The `!invoiceNow` early-close button becomes "Save & Book Later" (no scheduling needed)
- When `invoiceNow` is true and coming back, the "Open Schedule" button appears but the flow continues through to invoice

#### Flow logic
```text
Coming Back?
├── Invoice now? YES
│   ├── [Open Schedule] → navigates to /schedule, closes dialog
│   ├── [Book Later] → continues flow without scheduling
│   └── Next → continues to Job Notes → Labour → ... → Invoice → Send
└── Invoice now? NO
    ├── [Open Schedule & Close] → navigates to /schedule, closes dialog, toast
    └── [Save & Book Later] → closes dialog, toast "schedule when ready"
```

#### Files
1. **`src/components/job/SoleTraderCloseOutFlow.tsx`** — Remove calendar picker, add "Open Schedule" and "Book Later" buttons, update navigation logic

