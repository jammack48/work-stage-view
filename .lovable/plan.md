
Goal: fix return-booking so slot selection works reliably on the real Schedule grid, while preserving the “from close-out flow” context (job title) and confirming booking.

What I found
- In return-booking mode, slot clicks are attached to thin hourly row divs behind job cards.
- Existing job cards sit above those rows, so taps/clicks often hit cards (or nothing obvious), which feels like “can’t select slot.”
- Current schedule heading depends on `getJobDetail(returnJobId)`; for flow-created jobs (like `TB-NEW`), this can lose the real job title context from the close-out flow.

Clarified behavior
- You confirmed: “Can’t select slot” (selection itself is failing, not just save).

Implementation plan

1) Preserve job context when opening Schedule
- File: `src/components/job/SoleTraderCloseOutFlow.tsx`
- Update `handleOpenSchedule()` to pass query params with context, e.g.:
  - `returnJob`
  - `returnJobName`
  - `returnClient`
  - `returnAddress`
- This ensures Schedule always knows the correct job title from the pipeline flow.

2) Build a robust return-booking context in Schedule
- File: `src/pages/SchedulePage.tsx`
- Derive `returnBookingJob` from:
  1. query params (`returnJobName`, etc.) first
  2. fallback to `getJobDetail(returnJobId)`
- Use `returnBookingJob` everywhere currently using `returnJob`:
  - heading (`Book Return · <job title>`)
  - banner text
  - temporary booked card data
  - confirm toast text
- Remove hard dependency on `getJobDetail` for confirm path so booking never silently fails when detail lookup is incomplete.

3) Make slot selection reliably clickable in booking mode
- Files:
  - `src/components/schedule/TimeGridDesktop.tsx`
  - `src/components/schedule/TimeGridMobile.tsx`
- In “booking mode” (`onSlotClick` exists), render a dedicated top-layer slot overlay per day:
  - full column of hourly clickable blocks with `z-index` above job cards
  - clear hover/tap affordance
- Keep existing jobs visible underneath but non-interactive while booking (so taps always select slots).
- This avoids click interception by `ScheduleJobCard`.

4) Show clear visual feedback after selecting a slot
- Files:
  - `src/components/schedule/TimeGridDesktop.tsx`
  - `src/components/schedule/TimeGridMobile.tsx`
- Use existing `activeSlot` prop to render a highlighted 2-hour “pending return visit” block in the chosen slot.
- Keep Confirm button logic tied to `bookedSlot` so user immediately sees success state before confirming.

5) Keep return-to-flow behavior intact
- File: `src/pages/SchedulePage.tsx`
- On confirm: keep current back navigation to return to invoice pipeline, but ensure toast + selected job info always resolve from `returnBookingJob` fallback data.

Technical details
- No data model migration needed; this is UI/event-layer + query-param context fix.
- Main reliability change is layering: booking overlay sits above job cards only when `returnJob` flow is active.
- This keeps normal schedule behavior unchanged outside booking mode.
- Optional hardening: if needed, add a small “Booking mode active” hint in banner to explain why job cards aren’t clickable during slot selection.
