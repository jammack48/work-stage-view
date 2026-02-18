
# Toolbelt — Pipeline Dashboard Prototype

## Overview
A single-screen visual pipeline board for trade job management. 8 stage columns displayed horizontally, each showing a count of jobs as mini cards. Clicking a stage expands its jobs below the pipeline; clicking again collapses them. No menus, no tables — just a workflow command center.

## Visual Design
- **Background:** Warm neutral (#F4F1DE) across the whole page
- **Cards:** White, rounded corners, soft shadow
- **Typography:** Bold stage headers, clean readable job text, minimal decoration
- **Color system (traffic light):**
  - Early stages (Lead, To Quote): muted green tones
  - Mid stages (Quote Sent, Quote Accepted, In Progress): burnt orange tones
  - Late/attention stages (To Invoice, Invoiced): orange-red tones
  - Completed (Invoice Paid): solid green
- Column headers use solid stage color; column backgrounds use a light tint of the same color

## Pipeline Board (Top Section)
- **8 horizontal columns**, all visible simultaneously, equal width
- Stages: Lead → To Quote → Quote Sent → Quote Accepted → In Progress → To Invoice → Invoiced → Invoice Paid
- Each column shows:
  - Colored header with stage name + job count badge
  - Mini job cards stacked vertically within the column (scrollable if many)
- Each mini card shows: **Client name, Job name, Job value ($), Job ID, age indicator (e.g. "3d"), urgency icon** (warning triangle for items needing attention)
- 10 dummy jobs per stage = 80 total dummy jobs

## Interaction: Stage Expand/Collapse
- Clicking a stage column (or a specific card) expands a detail panel **below the pipeline board**
- The panel shows all jobs for that stage as larger, more detailed cards in a list/grid
- Clicking the stage again (or a close button) collapses the panel
- Only one stage can be expanded at a time
- Smooth animation for expand/collapse

## Top Bar
- Simple header with "Toolbelt" branding on the left
- Minimal — no complex navigation for this prototype

## Responsive Consideration
- Designed for desktop-first (wide screens to see all 8 columns)
- Columns will have a minimum width and horizontal scroll on smaller screens

## Dummy Data
- 10 realistic trade jobs per stage with NZ-style names, addresses, and job types (plumbing, electrical, HVAC, roofing, etc.)
- Job values ranging from $500 to $25,000
- Random age indicators (1d to 30d)
- ~20% of jobs flagged with urgency icons
