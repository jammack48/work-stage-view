

## Summary of Progress

### What We've Built

**Core App Structure**
- Trade picker (9 industries: electrical, HVAC, plumbing, glazing, building, mechanic, painting, landscaping, roofer)
- Mode picker (Manager, Tools/Work, Sole Trader, Timesheet, Intro)
- 4-position movable toolbar (top/left/bottom/right) — works across all modes
- Pipeline dashboard with 8 stages: Lead → To Quote → Quote Sent → Quote Accepted → In Progress → To Invoice → Invoiced → Invoice Paid

**Data Layer**
- Migrated from hardcoded JSON to database-backed `demo_jobs` table with trade-specific filtering
- `customers` table with auto-seeding
- Schedule view with trade-specific job name pools
- Trade change clears all state — fresh flow every time

**UI/UX**
- Intro mode walkthrough with invoice-sent return to home
- Mobile-responsive pipeline with carousel
- Manager mode, Work mode schedules, job cards, customer cards
- Notification styles, threshold settings, tutorial system

---

### Current Problem

Right now, `demo_jobs` is a shared template table. When someone moves a job from "Lead" to "Quote Sent", it either:
- Only changes in-memory (lost on refresh), or
- Would modify the shared row (corrupting it for everyone else)

Neither works for beta testing. We need **isolated, persistent, resettable demo sessions**.

---

## Plan: Session-Scoped Demo Architecture

### How It Works

```text
┌─────────────┐     on first visit      ┌──────────────────┐
│  Browser     │ ──────────────────────► │  demo_sessions   │
│  (sessionStorage │  create session UUID  │  id, created_at  │
│   = session_id)  │                      └────────┬─────────┘
└─────────────┘                                    │
       │            copy template jobs             │
       │         ┌─────────────────────────────────┘
       ▼         ▼
┌──────────────────────┐         ┌──────────────────┐
│  demo_session_jobs   │ ◄────── │  demo_jobs       │
│  session_id, job_id  │  COPY   │  (template only) │
│  stage, trade, ...   │         │  30-50 per trade  │
└──────────────────────┘         └──────────────────┘
       │
       │  UPDATE stage on drag
       ▼
  Persists across page refreshes
  Resets when browser closes (new sessionStorage = new session)
```

Each visitor gets their own copy of the 30-50 trade jobs. Stage moves write to `demo_session_jobs`. Closing the browser = new session = fresh data.

### Implementation Steps

**1. Database: Create session tables + expand seed data**
- Create `demo_sessions` table (id UUID, trade text, created_at timestamp)
- Create `demo_session_jobs` table (id UUID, session_id FK, job_id text, client text, job_name text, value numeric, age_days int, urgent bool, stage text, has_unread bool, trade text)
- Expand `demo_jobs` from 10 to ~40 jobs per trade (realistic mix across all 8 stages with varied values, ages, and urgency)
- Add RLS policies for public access (no auth yet)

**2. Database: Auto-cleanup old sessions**
- Create a database function + pg_cron job that deletes sessions older than 24 hours (catches any abandoned sessions even if browser didn't close cleanly)

**3. Backend service: Session-aware data layer**
- Update `dbDemoService.ts`:
  - `getOrCreateSession(trade)`: checks sessionStorage for session UUID → if none or different trade, creates new session + copies template jobs → returns session_id
  - `fetchSessionJobs(sessionId)`: reads from `demo_session_jobs` where session_id matches
  - `updateSessionJobStage(sessionId, jobId, newStage)`: writes stage change to DB
  - `resetSession(sessionId)`: deletes session jobs and re-copies from template

**4. Context: Wire up DemoDataContext**
- On trade selection, call `getOrCreateSession(trade)` to get/create isolated session
- `fetchDemoJobs` now reads from `demo_session_jobs` filtered by session
- `updateJobStage` now writes to DB (not just local state)
- `resetDemo` deletes and re-copies session jobs
- Session UUID stored in `sessionStorage` (auto-clears on browser close)

**5. Seed 30-40 realistic jobs per trade**
- Each trade gets jobs spread across all 8 stages with realistic names, varied dollar values ($500–$25,000), age days (0–30), mix of urgent/normal, some with unread flags
- Total: ~320 template rows across 8+ trades

### Files to Change

| File | Change |
|------|--------|
| Database migration | Create `demo_sessions` + `demo_session_jobs` tables with RLS |
| Database insert | Seed 30-40 jobs per trade into `demo_jobs` template |
| Database migration | pg_cron cleanup function for sessions > 24h |
| `src/services/dbDemoService.ts` | Add session management (create/fetch/update/reset) |
| `src/contexts/DemoDataContext.tsx` | Wire session lifecycle, persist stage moves to DB |

### What Beta Testers Get

- Pick a trade → get 30-40 realistic jobs across the full pipeline
- Drag jobs between stages → persists across page refreshes
- Close browser → next visit starts fresh
- Multiple testers at same time → completely isolated, no conflicts
- Stale sessions auto-cleaned after 24 hours

