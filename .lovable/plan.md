

## Issues Found

1. **Booking banner layout**: The banner text wraps word-by-word on narrow screens because `flex-wrap` + long text in a constrained container causes poor line breaks.

2. **No return to completion flow**: After confirming the booking on the schedule, `navigate(-1)` goes back to the job card but the `JobCompletionFlow` dialog is closed and there's no indication the booking succeeded. The user expects to land back on the job card with a visible "Return Visit Booked" confirmation (as shown in screenshot image-67).

## Plan

### 1. Fix booking banner layout on schedule page
- **File**: `src/pages/SchedulePage.tsx`
- Restructure the booking banner to stack vertically on mobile instead of using `flex-wrap`
- Keep the text as a single flowing line with `whitespace-nowrap` or constrained width
- Move Confirm/Cancel buttons below the text on narrow screens

### 2. Navigate back to job card with booking confirmation state
- **File**: `src/pages/SchedulePage.tsx`
- Change `handleConfirmBooking` to navigate to `/job/${returnJobId}` with search params `?returnBooked=true&returnDate=...&returnTime=...` instead of `navigate(-1)`

### 3. Show "Return Visit Booked" banner on job card
- **File**: `src/components/job/WorkJobCard.tsx`
- Read `returnBooked` search param on mount
- Display a green success banner at the top: "Return Visit Booked ✅ — Deck Lighting — Tue 3 Mar at 11am" (matching screenshot image-67)
- Banner persists on the page (dismissible with X or auto-fades)

### Technical details
- The schedule page already has `returnJobId` and `returnBookingJob` context from URL params — reuse these to build the return URL
- `WorkJobCard` reads `useSearchParams` to detect `returnBooked` and display the confirmation
- The `JobCompletionFlow` dialog stays closed after returning — the green banner replaces the need to re-enter the flow

