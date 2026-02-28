

## Add Work Mode (Staff/Field Worker View)

### Concept
On app load, show a mode picker: **Manage** (current full app for the boss) vs **Work** (stripped-down field worker view for staff). Persisted in localStorage so they don't choose every time.

### Work Mode — What Staff Need

Based on Fergus/Tradify patterns and the trades workflow:

```text
┌─────────────────────────────────┐
│  Work Mode Home                 │
│                                 │
│  Today's Schedule (primary)     │
│  ┌─────────────────────────┐    │
│  │ 8:00  Heat Pump Install │    │
│  │ 10:30 Switchboard       │    │
│  │ 1:00  Rewire - 42 Smith │    │
│  └─────────────────────────┘    │
│                                 │
│  My Jobs (list of assigned)     │
│  ┌─────────────────────────┐    │
│  │ Heat Pump Install - $X  │    │ ← no $ shown
│  │ Switchboard Upgrade     │    │
│  └─────────────────────────┘    │
│                                 │
│  Bottom toolbar:                │
│  [Schedule] [Jobs] [+ Job]      │
└─────────────────────────────────┘
```

### Work Mode Job Card — Limited Tabs
When a staff member opens a job, they see a restricted set of tabs:
- **Overview** — job name, address, customer contact, staff, schedule (no value/pricing)
- **Scope** — the approved quote description and materials list but **no prices** (qty + item name only)
- **Time** — start/stop timer, log hours
- **Materials** — items used on site, can add more (no buy/sell prices, just item + qty)
- **Notes** — add notes
- **Photos** — take/upload photos
- **Forms** — safety checklists etc.

Tabs NOT shown to staff: Quote, Invoice, Sequences, Messages, History, Spend.

### New Files
- **`src/contexts/AppModeContext.tsx`** — React context storing `"manage" | "work"`, persisted to localStorage. Provides `mode`, `setMode`, `isWorkMode`.
- **`src/components/ModePicker.tsx`** — Full-screen picker shown when no mode is set. Two large cards: "I'm the Boss" (Manage) and "I'm on the Tools" (Work). Also accessible from AppHeader to switch.
- **`src/pages/WorkHome.tsx`** — Work mode home page. Shows today's schedule (reuses existing schedule components filtered to "My Jobs") and a simple job list.
- **`src/components/job/WorkJobCard.tsx`** — Stripped-down job card for Work mode with limited tabs and no pricing.
- **`src/components/job/ScopeTab.tsx`** — New tab showing approved quote scope text and materials list without any pricing columns.

### Modified Files
- **`src/App.tsx`** — Wrap in `AppModeProvider`. If mode not set, show `ModePicker`. If work mode, route `/` to `WorkHome` instead of `Index`. Route `/job/:id` to `WorkJobCard` in work mode.
- **`src/components/AppHeader.tsx`** — Add a small mode indicator/switch button (e.g., a Wrench/Shield toggle) so user can switch between modes.
- **`src/config/toolbarTabs.ts`** — Add `WORK_JOB_EXTRAS` (Back, Overview, Scope, Time, Materials, Notes, Photos, Forms) and `WORK_HOME_TABS` (Schedule, Jobs, + Job).

### Key Design Decisions
- **No prices anywhere in Work mode** — materials show item + qty only, no unit price, no totals. Quote scope shows description and materials list only.
- **Can add items** — staff can add materials they used (item name + qty) and time entries. These feed back into the job for the manager to price later.
- **Schedule is primary** — Work mode home opens straight to today's schedule, not a pipeline.
- **Mode persisted** — stored in localStorage, changeable from header. No auth required (this is a UI-only prototype).

### Files Summary
| File | Action |
|------|--------|
| `src/contexts/AppModeContext.tsx` | Create — mode context + provider |
| `src/components/ModePicker.tsx` | Create — mode selection screen |
| `src/pages/WorkHome.tsx` | Create — staff home (schedule + job list) |
| `src/components/job/ScopeTab.tsx` | Create — quote scope without prices |
| `src/components/job/WorkJobCard.tsx` | Create — limited job card for staff |
| `src/config/toolbarTabs.ts` | Modify — add work mode tab sets |
| `src/App.tsx` | Modify — mode routing |
| `src/components/AppHeader.tsx` | Modify — mode switch button |

