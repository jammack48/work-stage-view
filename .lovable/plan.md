

# Job Card Screen - Full-Screen Job Workspace

## What We're Building
A full-screen job workspace that opens when you tap any job in the pipeline or use the action boxes. It replaces the dashboard entirely and gives you a single-focus control panel for one job -- Overview, Materials, Notes, Photos, Time, and Invoice tabs.

## How It Works

### Opening the Job Card
- Tapping any job card on the pipeline navigates to `/job/:id`
- Tapping an action box (Add Customer, New Quote, etc.) navigates to `/job/new?stage=Lead` (or whichever stage)
- The pipeline disappears completely -- full screen is the job

### Closing the Job Card
- Back button in the top strip returns to the pipeline dashboard
- Browser back also works (uses react-router)

---

## Screen Layout

### Top Strip (always fixed at top)
```text
+---------------------------------------------------------------+
|  <- Back  |  Job Name  |  Status Badge  |  Client  |  $Value  |
|           |            |                |  Address  |  [Call] [Msg] [Nav] [Status] |
+---------------------------------------------------------------+
```
- Fixed position, never scrolls
- Left: back arrow + job title
- Center: status pill (color-coded using existing theme), client name
- Right: action icons (Phone, MessageSquare, Navigation, status dropdown)
- Address shown on tap/hover of client name

### Left Sidebar (always visible on desktop)
```text
+----------+
| Overview |
| Materials|
| Notes    |
| Photos   |
| Time     |
| Invoice  |
+----------+
```
- Icon + label, vertical stack
- Large touch targets (48px+ height)
- Active tab highlighted with primary color
- Never collapses on desktop (fixed ~200px width)

### Main Panel
- Takes remaining space
- Content swaps based on selected tab
- Only one tab visible at a time

---

## Mobile Layout Options

The user wants both horizontal and vertical sidebar options on mobile:

- **Default: Bottom tab bar** -- 6 icons in a fixed row at the bottom (standard mobile pattern)
- **Toggle to side tabs** -- a small layout switcher lets you flip to a narrow left sidebar with icons
- Same layout toggle pattern already used on the pipeline dashboard (Top/Left buttons)

---

## Tab Content (Rich Dummy Data)

### 1. Overview
- Job summary card (title, description, address on a map placeholder)
- Assigned staff list (avatar + name, dummy data)
- Schedule section (start date, due date, duration)
- Alerts section (overdue warning if age > threshold, using existing status colors)

### 2. Materials
- Table/list of items: name, quantity, unit price, total
- Supplier name with link placeholder
- "Add Material" button at bottom
- Dummy data: 5-8 typical trade materials

### 3. Notes
- List of text notes with timestamps
- "Add Note" input area
- Voice note indicator (microphone icon + duration, visual only)
- Dummy data: 3-4 sample notes

### 4. Photos
- Photo grid (placeholder images using colored boxes with camera icon)
- "Upload Photo" button (visual only)
- Tap to expand placeholder
- Dummy data: 4-6 photo placeholders with captions

### 5. Time
- Time log entries: date, staff, hours, description
- "Start Timer" button with play icon (toggles to stop, visual only)
- Running timer display
- Dummy data: 5-6 time entries totaling realistic hours

### 6. Invoice
- Cost breakdown table: labour, materials, extras
- Subtotal, GST, Total
- "Generate Invoice" button
- Status indicator (Draft / Sent / Paid)
- Dummy data populated from materials + time entries

---

## Design Rules (Following Existing Theme)

- Same earthy color palette (dark/light mode support)
- Status colors: sage green, earthy tan, terracotta (already defined as CSS variables)
- Card backgrounds use `bg-card` with existing border styling
- Tab active state uses `bg-primary text-primary-foreground`
- Large buttons, minimal text, strong visual hierarchy
- Touch-friendly: minimum 44px tap targets on all interactive elements

---

## Technical Details

### New Files
| File | Purpose |
|------|---------|
| `src/pages/JobCard.tsx` | Main job card page with layout, top strip, sidebar, and tab routing |
| `src/components/job/JobTopStrip.tsx` | Fixed header with job info and action buttons |
| `src/components/job/JobSidebar.tsx` | Left sidebar / bottom tabs navigation |
| `src/components/job/OverviewTab.tsx` | Overview tab content |
| `src/components/job/MaterialsTab.tsx` | Materials list tab |
| `src/components/job/NotesTab.tsx` | Notes tab |
| `src/components/job/PhotosTab.tsx` | Photos gallery tab |
| `src/components/job/TimeTab.tsx` | Time tracking tab |
| `src/components/job/InvoiceTab.tsx` | Invoice/billing tab |
| `src/data/dummyJobDetails.ts` | Rich dummy data for all tab content |

### Modified Files
| File | Change |
|------|--------|
| `src/App.tsx` | Add route `/job/:id` pointing to JobCard |
| `src/components/StageColumn.tsx` | Make job cards clickable (navigate to `/job/:id`) |
| `src/components/ExpandedStagePanel.tsx` | Make job rows clickable |
| `src/pages/Index.tsx` | Wire action boxes to navigate to `/job/new?stage=X` |

### Routing
- `/` -- Pipeline Dashboard (existing)
- `/job/:id` -- Job Card (new)
- `/job/new?stage=Lead` -- New job entry (new, same component with empty state)

### No New Dependencies
Everything built with existing stack: React Router, Lucide icons, Tailwind, shadcn/ui components.

