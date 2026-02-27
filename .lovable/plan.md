

## Plan: Four Fixes

### 1. Unread Inbox → Customer Messages (not Job/Quote)
**Problem**: `UnreadInbox` navigates to `/job/:id?tab=messages` or `/quote/:id?tab=messages`. User wants it to go to the **customer's** messaging system.

**Fix** in `src/components/UnreadInbox.tsx`:
- Map each unread job's `client` name to the matching customer ID from `DUMMY_CUSTOMERS`
- Navigate to `/customer/:customerId?tab=messages` instead of job/quote routes

Also update `src/pages/CustomerCard.tsx` to read `?tab=messages` from URL params and initialize `activeTab` from it (same pattern as JobCard).

### 2. Unread Indicators on Customer List
**Fix** in `src/pages/Customers.tsx`:
- Import `UNREAD_CLIENTS` from `dummyJobs`
- For each customer row, if `UNREAD_CLIENTS.has(c.name)`, show a blue glowing dot and animated mail icon next to their name

### 3. Sticky Toolbar on All Screens
**Fix** in `src/components/PageToolbar.tsx`:
- Desktop vertical sidebar: add `sticky top-0 h-screen overflow-y-auto` to the `<nav>`
- Desktop horizontal bar: add `sticky top-0 z-40` to the `<nav>`
- These changes ensure the toolbar stays visible when content scrolls

### 4. Pipeline Cards: Header Expands List, Card Navigates to Job
**Problem**: Clicking anywhere on the stage column toggles expand. User wants: clicking the **header** expands, clicking a **color card** navigates directly to the first job shown on that card.

**Fix** in `src/components/StageColumn.tsx`:
- Remove the `onClick={onToggle}` from the outer container div
- Add `onClick={onToggle}` only to the header div
- Add `onClick` to each color card (green/orange/red) that navigates to the first job in that bucket (e.g., `navigate(/job/:id)` or `/quote/:id` based on stage), with `e.stopPropagation()`
- If no jobs in that bucket, clicking does nothing

