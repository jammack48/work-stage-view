

## Fix three issues: "Book Later" flow, duration prompt, and overlap display

### Issue 1: "Book Later" closes the dialog instead of continuing the flow

**Problem**: In both `JobCompletionFlow` (line 211-213) and `SoleTraderCloseOutFlow` (line 215-217), `handleBookLater()` calls `onOpenChange(false)` which closes the entire dialog. The user expects to continue through the remaining steps (job sheet, time, parts, photos, etc.) after choosing "Book Later".

**Fix** in both files:
- Change `handleBookLater` to save the return note, set `jobFinished` to `true` (so the remaining steps become active), then advance to the next step (`setStep(1)` / `goToStep(1)`) instead of closing the dialog.
- Show a small toast confirming "Return visit noted" but keep the dialog open.
- The flow continues from Job Sheet → Time → Parts → Photos → etc. as normal.

### Issue 2: Return visit booking hardcodes 2 hours — should ask

**Problem**: In `SchedulePage.tsx`, the return visit block is hardcoded to 2 hours (`durationHours: 2` on line ~67). Users should be able to specify how many hours they need.

**Fix** in `SchedulePage.tsx`:
- Add a `returnDuration` state (default 2).
- In the return booking banner, add a simple selector: "How many hours?" with options 1–8 (or a small number input).
- Use `returnDuration` instead of the hardcoded `2` when creating the temporary job and rendering the highlight block.

**Fix** in `TimeGridDesktop.tsx` and `TimeGridMobile.tsx`:
- Pass `activeDuration` prop (instead of hardcoding `2 * HOUR_HEIGHT`) for the active slot highlight height.

### Issue 3: Overlapping return visit should display side-by-side (Fergus-style)

**Problem**: Currently, the return visit booking overlay sits on a z-50 layer above all job cards, hiding them. When a return visit is placed on an occupied slot, it should display side-by-side with the existing job, not on top of it.

**Fix**: The overlap layout logic (`computeOverlapLayout`) already handles side-by-side display perfectly. The fix is:
- In `SchedulePage.tsx`, when `bookedSlot` is set, inject the return visit job into the `allJobs` array (already done) — this makes it participate in the overlap layout automatically.
- In `TimeGridDesktop.tsx` and `TimeGridMobile.tsx`, remove the separate "Active slot highlight" block that renders on top. The return visit job card will naturally appear side-by-side via the existing overlap layout.
- Keep the clickable overlay for slot selection, but remove the separate 2-hour highlight div since the job card itself serves as the visual indicator.

### Issue 4 (bonus): Desktop grid only shows 5 columns for 7 days

The desktop grid template is `grid-cols-[60px_repeat(5,1fr)]` but renders 7 day columns. Change to `repeat(7,1fr)`.

### Files changed
1. **`src/components/job/JobCompletionFlow.tsx`** — `handleBookLater` continues flow instead of closing
2. **`src/components/job/SoleTraderCloseOutFlow.tsx`** — same fix
3. **`src/pages/SchedulePage.tsx`** — add duration state + selector in banner, pass duration to grids
4. **`src/components/schedule/TimeGridDesktop.tsx`** — accept `activeDuration` prop, fix grid to 7 cols, remove separate highlight div
5. **`src/components/schedule/TimeGridMobile.tsx`** — accept `activeDuration` prop, remove separate highlight div

