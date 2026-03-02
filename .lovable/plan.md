
Goal
- Make return booking work end-to-end from the Sole Trader close-out flow, with reliable slot selection on touch devices and correct job-context heading.

What I found
1) Flow-to-route mismatch in Work mode:
- `SoleTraderCloseOutFlow` is only used in `WorkJobCard` (Work mode).
- `handleOpenSchedule()` navigates to `/schedule?...`.
- In `App.tsx`, Work mode routes do not include `/schedule`; unmatched paths fall back to `WorkHome`.
- This can break “from flow” behavior and produce inconsistent results.

2) Touch selection reliability issue on mobile:
- `TimeGridMobile` uses parent-level swipe handlers (`onTouchStart/onTouchMove/onTouchEnd`) plus slot `onClick`.
- During real touch use, swipe logic can cancel/consume interactions before click synthesis, causing “No slot selects”.

3) Current desktop booking overlay is generally correct:
- Overlay exists and can select slots in pointer/mouse testing, so the core state path (`bookedSlot`, confirm, banner) is mostly fine.

4) Extra console issues to clean up:
- `DialogHeader` ref warning and missing dialog description warning in `SoleTraderCloseOutFlow` path (accessibility + stability cleanup).

Implementation plan
1) Fix routing so Open Schedule always lands on booking page from Work flow
- File: `src/App.tsx`
- Add `/schedule` route under Work mode route set (pointing to `SchedulePage`).
- Keep existing Manager route unchanged.
- Outcome: `navigate('/schedule?...')` from `SoleTraderCloseOutFlow` always resolves correctly.

2) Make mobile slot selection touch-first (not click-dependent)
- File: `src/components/schedule/TimeGridMobile.tsx`
- In booking mode (`onSlotClick` present):
  - Disable/short-circuit day-swipe touch handlers so booking taps are never interpreted as swipe.
  - Add explicit touch/pointer handlers on slot overlay blocks (`onPointerDown` or `onTouchEnd`) to call `onSlotClick` directly.
  - Keep `onClick` as fallback for non-touch.
  - Use `e.stopPropagation()` where needed to avoid parent interference.
- Outcome: reliable tap-to-select on phones/tablets.

3) Harden overlay interaction priority in both grids
- Files:
  - `src/components/schedule/TimeGridMobile.tsx`
  - `src/components/schedule/TimeGridDesktop.tsx`
- Raise booking overlay priority and interaction consistency:
  - Ensure overlay is top-most in booking mode (`z-50`).
  - Ensure job-card containers are explicitly lower layer in booking mode (or pointer-events disabled while booking).
- Outcome: no interception by job cards or other grid elements.

4) Preserve and display return-job context consistently
- Files:
  - `src/components/job/SoleTraderCloseOutFlow.tsx`
  - `src/pages/SchedulePage.tsx`
- Keep/verify query-param context (`returnJobName`, `returnClient`, `returnAddress`) as primary source.
- Keep fallback to `getJobDetail`.
- Ensure heading/banner/temporary booked block/confirm toast all use the same `returnBookingJob`.
- Outcome: heading always shows correct job title from originating flow.

5) Clean up dialog warnings impacting this flow
- Files:
  - `src/components/job/SoleTraderCloseOutFlow.tsx`
  - `src/components/ui/dialog.tsx` (only if needed)
- Add `DialogDescription` in close-out dialog content.
- Remove/refactor any place passing refs to non-forwardRef function components in this dialog path.
- Outcome: eliminate warnings and reduce interaction edge cases.

Validation plan (end-to-end)
1) Work mode E2E:
- Open job → Finish & Invoice → Coming Back → Open Schedule.
- Verify URL includes return params and page heading is `Book Return · <Job Title>`.

2) Slot interaction tests:
- Mobile/touch: tap multiple empty slots (including over busy columns) and confirm selection appears every time.
- Desktop: click slots still works and confirm appears.

3) Confirm path:
- Tap Confirm, verify success toast shows selected day/time + job title, then returns to originating flow/page.

4) Regression checks:
- Day swipe still works in normal mobile schedule mode (non-booking).
- Job cards remain clickable in normal mode (outside booking overlay).
- No new console warnings/errors in this path.

Technical details
- Primary fix is event-model separation: booking mode should prioritize direct slot selection and not share gesture logic with day-swipe.
- Secondary fix is route completeness in Work mode to support the flow entry point.
- No backend/data-model changes required.
