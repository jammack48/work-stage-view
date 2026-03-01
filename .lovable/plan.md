

## Work Mode: Quick Notes + Team Chat System

### What we are building

Two new features for Work Mode (tradesman view):

1. **Quick Notes pad** — A persistent notes section on the Work Home screen where tradesmen can quickly dictate or type notes from a customer conversation, with an option to attach the note to a specific job. Notes appear in a feed with timestamps and can optionally link to any active job.

2. **Team Chat (Channels)** — A Slack-like group messaging system accessible from the bottom nav, with:
   - **General channel** for company-wide announcements from management
   - **Job-linked channels** that auto-create a thread per job so all comms/notes/tasks stay together
   - **@mentions** to tag staff members
   - Management can broadcast messages to all staff

### Changes

#### 1. `src/pages/WorkNotes.tsx` — New page

- Quick-capture area at top: textarea with Mic button (voice dictation placeholder) and "Add" button
- Optional job attachment: a Select dropdown listing active jobs (from DEMO_JOBS filtered to current staff) — defaults to "No job" (general note)
- Notes feed below showing recent notes with author, timestamp, linked job badge (tappable to navigate to job), and voice indicator
- Uses dummy data for existing notes

#### 2. `src/pages/WorkChat.tsx` — New page

- Left panel: channel list (General, Announcements, plus auto-generated job channels like "#job-switchboard-upgrade")
- Right/main panel: message thread for selected channel
- Compose bar at bottom with text input, send button, and @mention trigger
- Messages show author avatar, name, timestamp, and optional job tag
- Demo data: a few messages in General from "Management" and job-specific threads
- @mention: typing `@` shows a dropdown of staff names; selected name renders as a blue badge in the message

#### 3. `src/data/dummyTeamChat.ts` — New data file

- Channel definitions: `{ id, name, type: "general" | "job", jobId?, icon }`
- Messages: `{ id, channelId, author, avatar, text, timestamp, mentions?: string[], jobId? }`
- Demo channels: General, Announcements, #job-switchboard, #job-bathroom-reno
- Demo messages from management and staff

#### 4. `src/components/WorkBottomNav.tsx` — Update

- Add two new nav items: **Notes** (StickyNote icon, path `/work-notes`) and **Chat** (MessageCircle icon, path `/work-chat`)
- Reorder: Schedule, Notes, New Job (center FAB), Chat, Hub — drop Timesheet to a sub-page or move into Hub
- Total 5 items: Schedule | Notes | + New Job | Chat | Hub

#### 5. `src/App.tsx` — Add routes

- `/work-notes` → `WorkNotes`
- `/work-chat` → `WorkChat`

#### 6. `src/components/job/NotesTab.tsx` — Enhancement

- Add an "Attach to job" badge on notes that came from the quick-notes pad (cross-reference)
- Show a link icon on notes that were dictated from WorkNotes so they appear in both places

### Technical details

- Team chat is fully client-side with local state (no backend) — messages are added to a useState array
- @mention detection: regex `/(?:^|\s)@(\w+)/` in the compose input triggers a filtered staff dropdown
- Channel list uses a simple vertical list with unread dot indicators
- Notes use the existing `NoteEntry` interface from `dummyJobDetails.ts`, extended with an optional `jobId` field
- Bottom nav goes from 4 to 5 items, keeping the center FAB pattern for New Job

