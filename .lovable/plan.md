

## Manager Mode — Pipeline Task Triage

A new "Manager" tab on the pipeline toolbar that opens a full-screen triage workspace. Designed for rapid mobile-first task management — pick a stage, pick a priority, then swipe through jobs one-by-one taking action.

### Flow

```text
┌─────────────────────────────┐
│  Stage Picker (8 stage pills)│
├─────────────────────────────┤
│  Priority Filter: 🔴 🟠 🟢  │
├─────────────────────────────┤
│  ┌─────────────────────────┐│
│  │  Job Card (swipeable)   ││
│  │  Client · Job · Value   ││
│  │  Age: 14 days (RED)     ││
│  │                         ││
│  │  History Timeline       ││
│  │  ─ Created 14d ago      ││
│  │  ─ Quote sent 10d ago   ││
│  │                         ││
│  │  Sequence Status        ││
│  │  ─ Email #1: Opened ✓   ││
│  │  ─ SMS #2: Not opened ✗ ││
│  │                         ││
│  │  ┌─────────┬──────────┐ ││
│  │  │ Archive │ On Hold  │ ││
│  │  ├─────────┼──────────┤ ││
│  │  │ Add Note│ Call Back │ ││
│  │  ├─────────┼──────────┤ ││
│  │  │ Move Stage│ Open Job│ ││
│  │  └─────────┴──────────┘ ││
│  │                         ││
│  │  [Note input + Save]    ││
│  └─────────────────────────┘│
│     ◀ 3/7 ▶  (swipe L/R)   │
└─────────────────────────────┘
```

### Stage-Specific Quick Actions

| Stages | Unique Actions |
|--------|---------------|
| Lead, To Quote | Archive, Add Note, Convert to Quote, Call Back |
| Quote Sent | Archive, Add Note, Resend Quote, Call Back, Mark Accepted |
| Quote Accepted | Add Note, Schedule Job, Call Back |
| In Progress | Add Note, On Hold (parts/staff), Mark Complete, Call Back |
| To Invoice | Add Note, Create Invoice, On Hold |
| Invoiced | Add Note, Resend Invoice, Call Back, Mark Paid |
| Invoice Paid | Add Note, Archive, Request Review |

### Changes

| File | Change |
|------|--------|
| `src/config/toolbarTabs.ts` | Add "manager" tab to `PIPELINE_EXTRAS` with `Shield` icon |
| `src/pages/Index.tsx` | Add "manager" to `HomeView` type, render `ManagerMode` when active |
| `src/components/ManagerMode.tsx` | New component — stage picker, priority filter, swipeable job cards with history/sequence/actions |
| `src/data/dummyJobs.ts` | Add `getJobColor` utility function (reuse threshold logic) |

### Implementation Details

- **Stage picker**: horizontal scrollable pills, all 8 stages, highlighted when selected
- **Priority filter**: 3 color buttons (red/orange/green), filters jobs from selected stage using threshold context
- **Job card carousel**: Embla carousel, one card at a time, swipe left/right between filtered jobs, counter shows position
- **History section**: dummy timeline entries per job (created, quote sent, etc.) based on stage
- **Sequence status**: dummy follow-up tracking (email opened/not opened, SMS delivered)
- **Quick actions**: 6 buttons in 2x3 grid, stage-specific labels, each shows toast confirmation
- **Note input**: textarea + save button at bottom, saves with toast
- **Mobile-first**: full height, touch-friendly buttons (min 44px), swipe navigation

