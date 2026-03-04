

## Fix Two Issues in Work Mode

### Issue 1: Toolbar cycler has no effect in Work mode

Work mode pages (`WorkHome`, `WorkHub`, `WorkNotes`, `WorkChat`, `WorkTimesheet`) don't use the `PageToolbar` component — only `WorkJobCard` does. Clicking the LayoutGrid icon changes the stored position but nothing visually changes on most Work screens.

**Fix**: Hide the LayoutGrid button on Work mode pages that don't use `PageToolbar`. Since `WorkJobCard` (job detail page) does use `PageToolbar`, only show the cycler when on a `/job/` route in Work mode.

**`src/components/AppHeader.tsx`**:
- Change the visibility condition from always-shown to: show when `!isWorkMode` (Office mode — all pages use PageToolbar) OR when `isWorkMode && pathname.startsWith("/job/")` (Work job card uses PageToolbar).

### Issue 2: Tutorial icon highlighted but no tutorials appear in Work mode

The `getTutorialKey()` function in `tutorialContent.ts` maps `"/"` to `"pipeline"` — but in Work mode, `/` renders `WorkHome`, not the pipeline. Work mode routes (`/`, `/hub`, `/work-notes`, `/work-chat`, `/work-hub`, `/timesheet`) have no tutorial key mappings, so the banner never appears even though the icon is blue.

**Fix in `src/data/tutorialContent.ts`**:
- Add Work mode tutorial entries to `tutorialPages`:
  - `"work-home"` — schedule/day view explanation
  - `"work-hub"` — docs, training, certs hub
  - `"work-notes"` — personal notes
  - `"work-chat"` — team chat
  - `"work-timesheet"` — timesheet

**Fix in `src/data/tutorialContent.ts` (`getTutorialKey`)**:
- The function can't know which mode is active. Instead, have Work mode pages pass `overrideKey` to `TutorialBanner`.

**Fix in Work mode pages** (`WorkHome.tsx`, `WorkHub.tsx`, `WorkNotes.tsx`, `WorkChat.tsx`, `WorkTimesheet.tsx`):
- Add `<TutorialBanner overrideKey="work-home" />` (etc.) to each page so the correct tutorial content appears.

### Files changed
1. `src/components/AppHeader.tsx` — conditionally show LayoutGrid based on route + mode
2. `src/data/tutorialContent.ts` — add work mode tutorial entries
3. `src/pages/WorkHome.tsx` — add TutorialBanner with `overrideKey="work-home"`
4. `src/pages/WorkHub.tsx` — add TutorialBanner with `overrideKey="work-hub"`
5. `src/pages/WorkNotes.tsx` — add TutorialBanner with `overrideKey="work-notes"`
6. `src/pages/WorkChat.tsx` — add TutorialBanner with `overrideKey="work-chat"`
7. `src/pages/WorkTimesheet.tsx` — add TutorialBanner with `overrideKey="work-timesheet"`

