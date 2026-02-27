

# Full App Beta Test Audit — Issues & Fixes

After walking through every page as a tradie would, here are the issues found, grouped by severity.

---

## Critical Issues (Broken / Confusing UX)

### 1. Customer link on Job Overview always goes to `/customer/1`
In `src/components/job/OverviewTab.tsx` line 72, the customer link is hardcoded to `navigate('/customer/1')` regardless of which customer it is. A tradie clicks their customer's name and always sees the wrong person.

### 2. Hub page — CRM, Calendar, Payroll tiles lead to dead "Coming Soon" page
12 of 13 hub tiles navigate to `/coming-soon` which is a dead end. Only "Job Management" works. A tradie lands here first and thinks the app is empty. Should at least route Calendar to `/schedule` and CRM to `/customers`.

### 3. Pipeline "Add Customer" button goes to `/customers` not a "new customer" flow
The `+` dashed box under Lead says "Add Customer" but navigates to the customer list — there's no create-customer form anywhere.

### 4. Unread Inbox popover on mobile — fixed 340px width overflows small screens
`UnreadInbox` has `w-[340px]` hardcoded. On a 320px phone this overflows. Should use `w-[calc(100vw-2rem)]` or render as a drawer on mobile.

### 5. Schedule page "Back" button goes to `/` but there's no obvious way to get TO the schedule from pipeline
The pipeline toolbar has a Schedule tab but on SchedulePage the only tabs are Back and Settings — no way to get to Customers or Pipeline without hitting Back. Navigation feels one-directional.

---

## UX Issues (Confusing / Annoying for a Tradie)

### 6. Pipeline has 8 stages but mobile carousel only shows one at a time — no stage labels visible
When swiping, a tradie can't tell which stage they're on without counting dots. Need a visible stage name above/below the carousel.

### 7. PipelineFlowBanner only shows on desktop horizontal mode — mobile gets nothing
The flow banner showing all 8 stages with the active one highlighted is desktop-only. Mobile has no orientation of where they are in the pipeline.

### 8. Manager Mode note state is shared across all cards
`note` state is a single string shared across all job cards in the swipe carousel. If you start typing a note on one card and swipe to the next, the note carries over. Should be per-job.

### 9. Settings notification toggles are fake
The notification toggle switches in Settings are just CSS divs (`<div className="w-10 h-5 rounded-full...">`) not actual `<Switch>` components. They don't toggle.

### 10. Job overview "Open in Maps" link doesn't actually open maps
Line 149 of OverviewTab — it's just text, not a clickable link. Should be an `<a href>` to Google Maps.

### 11. No way to create a new customer
There's an "Add Customer" button on the Customers page but it doesn't do anything — no onClick handler or form.

### 12. Quote/Invoice "Discard" and "Save Draft" do the same thing
In both QuotePage and InvoicePage, `handleLeaveConfirm` ignores the `saveDraft` parameter (InvoicePage doesn't even have one) — both just proceed. The user thinks they're saving a draft but nothing actually saves.

### 13. Customer Card "New Job" button goes to `/job/new?stage=Lead` without pre-filling the customer
The job isn't associated with the customer they're viewing.

---

## Polish Issues (Small but noticeable)

### 14. Hub "CRM" should say "Customers" and link to `/customers`
### 15. Hub "Calendar" should link to `/schedule` since it exists
### 16. ExpandedStagePanel sorts green→orange→red (least urgent first) — should be red first for a tradie
### 17. Double chevrons `>>` on stage headers are confusing — look like a button but on mobile they advance the carousel
### 18. ThresholdSettings gear icon in stage header is tiny and easy to miss
### 19. Mobile bottom bar label text at 9px is too small to read

---

## Implementation Plan

### Batch 1: Critical fixes
1. **Fix customer link in OverviewTab** — look up actual customer ID from `DUMMY_CUSTOMERS` by matching `job.client` name
2. **Fix Hub routing** — route CRM→`/customers`, Calendar→`/schedule`
3. **Fix UnreadInbox mobile overflow** — use drawer on mobile, cap width on desktop
4. **Add current stage name to mobile carousel** — show stage name between prev/next buttons

### Batch 2: UX fixes
5. **Per-job notes in ManagerMode** — change `note` state from single string to `Record<string, string>`
6. **Fix Settings notification toggles** — replace fake div toggles with actual `<Switch>` components
7. **Fix "Open in Maps" link** — make it an actual Google Maps link using the job address
8. **Fix ExpandedStagePanel sort order** — reverse to red→orange→green (urgent first)
9. **Wire up "Add Customer" button** — add a simple inline form or toast placeholder

### Batch 3: Polish
10. **Fix Quote/Invoice discard vs save draft** — at minimum toast different messages
11. **Pass customer context to new job** — pre-fill customer ID in the URL
12. **Mobile bottom bar labels** — bump from 9px to 10px
13. **Add schedule/customers to Schedule toolbar** — so you're not trapped

