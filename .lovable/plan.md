

# Phase 1 — Critical Bug Fixes

## 1. Wire customer data from New Job flow to job card
- Store customer name, address, and description in a shared context or pass via React Router `state` when navigating to `/job/TB-NEW`
- Update `JobCard.tsx` / `WorkJobCard.tsx` to read `location.state` and override the hardcoded "Dave Thompson" values
- Update `getJobDetail("TB-NEW")` to accept optional overrides

## 2. Fix schedule job navigation in Work mode
- Map demo schedule job IDs (`J-001`, `J-002`, etc.) to entries in `dummyJobDetails` so tapping a scheduled job doesn't show "Job not found"
- Add fallback job detail entries for all `DEMO_JOBS` IDs

## 3. Fix double bottom bar overlap in Work mode
- In `ToolbarPositionContext` or `PageToolbar`, force toolbar position to `"top"` when Work mode is active, preventing overlap with `WorkBottomNav`

## 4. Unify toast library
- Replace all `sonner` toast calls (found in `LeadActionMenu.tsx`) with `@/hooks/use-toast`
- Remove `sonner` Toaster component if no longer needed

## 5. Fix React ref warnings
- Wrap `AppLayout` and `ModePicker` with `React.forwardRef` or remove ref passing from parent components

## 6. Wire Timesheet button to Coming Soon page
- Update `WorkBottomNav` so the Timesheet button navigates to `/coming-soon` instead of doing nothing

---

# Phase 2 — UX Polish

## 7. Add leave-confirmation to New Job flow
- Prompt user when navigating away from a partially-filled new job form (steps 2/3 with data entered)

## 8. Add "Today" quick-jump to DayStrip
- Add a small "Today" button that resets week and selected day to current date

## 9. Add toolbar tab overflow menu on mobile
- When tabs exceed screen width, group extras behind a "More" dropdown

---

# Files to modify
- `src/data/dummyJobDetails.ts` — add fallback entries for schedule job IDs
- `src/pages/WorkNewJob.tsx` — pass customer data via navigation state
- `src/pages/JobCard.tsx` — read location state for TB-NEW overrides
- `src/components/job/WorkJobCard.tsx` — same override support
- `src/contexts/ToolbarPositionContext.tsx` — force top in Work mode
- `src/components/PageToolbar.tsx` — respect Work mode override
- `src/components/LeadActionMenu.tsx` — switch from sonner to use-toast
- `src/components/WorkBottomNav.tsx` — wire Timesheet button
- `src/App.tsx` — fix ref forwarding on AppLayout/ModePicker
- `src/components/ModePicker.tsx` — add forwardRef
- `src/components/schedule/DayStrip.tsx` — add Today button

