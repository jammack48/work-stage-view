

# Overview Tab Redesign - Single-Screen Desktop Layout

## The Problem
Currently the Overview tab has 5 separate stacked cards that require scrolling on desktop. The content should all be visible at once without scrolling.

## The New Layout

The Overview becomes a single-screen layout using a 2-column grid on desktop (single column on mobile):

### Structure
```text
+------------------------------------------+---------------------------+
| STATUS CARD                              | STAFF + SCHEDULE          |
| Stage badge (Lead/Quote/Job/Invoice)     | Assigned staff avatars    |
| Summary line (contextual to stage)       | Start / Due / Age         |
| Job name, value, ID                      |                           |
| Alert banner (if urgent/overdue)         |                           |
+------------------------------------------+---------------------------+
| CUSTOMER DETAILS                         | SITE DETAILS              |
| Name                                     | Address                   |
| Phone (tap to call)                      | Map placeholder           |
| Email (tap to email)                     |                           |
+------------------------------------------+---------------------------+
```

### Key Changes

1. **Single status card at top-left** -- stage badge is prominent, with a contextual summary line:
   - Lead: "Lead to follow up"
   - Quote Sent: "Quote awaiting acceptance"  
   - In Progress: "Job in progress"
   - To Invoice: "Ready to invoice"
   - etc.

2. **Staff and Schedule merged** into one card (top-right) -- staff avatars inline, schedule dates below

3. **Customer and Site side-by-side** on the bottom row -- removes the large map placeholder to save vertical space (small inline map icon instead)

4. **No max-width constraint** -- currently capped at `max-w-2xl`, will be removed so it uses all available main panel space

5. **Compact card padding** -- tighter spacing so everything fits on one screen

## Technical Details

### File Changed
`src/components/job/OverviewTab.tsx` -- restructured from 5 vertical cards to a 2x2 grid layout

### Layout Classes
- Desktop: `grid grid-cols-2 gap-3` with `h-full` to fill the panel
- Mobile: `grid grid-cols-1 gap-3` (scrollable, since single-screen isn't feasible on small screens)
- Cards use compact padding (`p-3` instead of `p-6`)
- Map placeholder shrunk to a small icon row instead of a 128px block

