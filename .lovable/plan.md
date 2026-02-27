

## Analysis: What's Already Built vs What's Needed

ChatGPT's list has significant overlap with existing features. Here's the honest assessment:

| Suggestion | Status | Notes |
|---|---|---|
| Sequence Builder UI | **Already built** | `SequencesTab` + `FollowUpSequenceBuilder` — stacked blocks, channel/delay/template, edit/create/delete |
| Email Template Editor | **Already built** | Subject, body, variables dropdown, active toggle |
| SMS Template Editor | **Already built** | Character counter, 160-char indicator, variables |
| Manager Mode | **Already built** | Priority filtering, history timeline, sequence status, quick actions |
| Messages tab (Job Card) | **Not built** | This is the big new piece |
| Compose panel | **Not built** | Needed alongside Messages tab |
| Manager notification counters | **Not built** | "2 Quotes Awaiting Reply" style badges |
| Customer Comms Summary | **Not built** | Total messages, last contact, last reply |
| Notification badges (red dots) | **Not built** | Visual urgency cues |

---

## Plan: Build the 5 Missing Pieces

### 1. Messages Tab in Job Card
- Add a new "Messages" tab to `JOB_EXTRAS` in `toolbarTabs.ts` (Mail icon)
- Create `src/components/job/MessagesTab.tsx`
- Left side: conversation thread with dummy messages
  - SMS shown as grey rounded bubbles (outbound right-aligned, inbound left-aligned)
  - Email shown as white bordered cards with subject line
  - Each message gets: channel icon, timestamp, status badge (Sent / Delivered / Replied / Opened)
- Right side (desktop) / bottom (mobile): compose panel
- Wire into `JobCard.tsx` tab routing
- Generate dummy conversation data in `src/data/dummyMessages.ts`

### 2. Compose Panel (inside Messages Tab)
- Email/SMS toggle switch at top
- Template dropdown (filtered by channel, pulls from `dummyTemplates`)
- Editable subject field (email only)
- Editable body textarea
- "Attach sequence" checkbox with sequence dropdown
- Send button with subtle animation on click
- All visual only — button shows toast "Message sent"

### 3. Manager Mode Notification Counters
- Add summary badges at the top of Manager Mode: "2 Quotes Awaiting Reply", "3 Invoices Overdue", "5 Messages Unread"
- Computed from existing dummy job data (count jobs per stage that are red priority)
- Tappable — sets the stage filter when clicked
- Styled as compact coloured pills

### 4. Customer Communication Summary Card
- Add a new card to the Customer Card overview tab
- Shows: Total messages sent, Last contact date, Last reply date, Open quotes count, Outstanding balance
- All dummy data, visually positioned as a CRM-grade summary

### 5. Notification Badges (Red Dots)
- Add red dot indicators to toolbar tabs that have "unread" items
- Messages tab: red dot when unread replies exist
- Sequences tab: red dot when a sequence is paused
- Small absolute-positioned dot on the toolbar icon
- Driven by dummy state

---

### Files to Create
- `src/data/dummyMessages.ts` — mock conversation data
- `src/components/job/MessagesTab.tsx` — conversation thread + compose panel

### Files to Modify
- `src/config/toolbarTabs.ts` — add Messages tab to JOB_EXTRAS
- `src/pages/JobCard.tsx` — wire Messages tab
- `src/components/ManagerMode.tsx` — add notification counter pills
- `src/pages/CustomerCard.tsx` — add Communication Summary card to overview
- `src/components/PageToolbar.tsx` — support red dot badges on tabs

