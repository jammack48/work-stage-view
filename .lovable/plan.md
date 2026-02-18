

## Add Workflow Direction Indicator to Pipeline

### Problem
The pipeline columns don't visually communicate the left-to-right workflow progression from Lead through to Invoice Paid.

### Solution
Add a subtle chevron/arrow banner running across the top of the pipeline board, sitting just above the stage columns. This creates a clear visual flow direction without cluttering the cards themselves.

### Design Approach
- A thin banner strip above the columns with repeating chevron arrows (like a hazard/conveyor belt pattern)
- Uses the earthy muted palette -- subtle background chevrons in a slightly lighter/darker shade
- Stage names appear inline within the banner connected by arrow indicators
- The banner spans the full width of the pipeline, reinforcing the left-to-right flow

### What It Will Look Like

```text
|  Lead  -->  To Quote  -->  Quote Sent  -->  Quote Accepted  -->  In Progress  -->  To Invoice  -->  Invoiced  -->  Invoice Paid  |
|  [col]      [col]          [col]            [col]               [col]             [col]           [col]          [col]           |
```

The banner will be a single horizontal bar with:
- Stage names in sequence separated by chevron arrows
- A subtle gradient or repeating chevron pattern in the background (CSS-based, no images)
- Muted colors so it guides the eye without distracting from the data below
- Highlights the currently expanded stage if one is selected

### Technical Details

**Files to modify:**

1. **`src/pages/Index.tsx`** -- Add a `<PipelineFlowBanner>` component above the grid in horizontal layout. It receives the list of stages and the currently expanded stage.

2. **`src/components/PipelineFlowBanner.tsx`** (new file) -- A horizontal bar component that:
   - Maps over `STAGES` and renders each label with a `ChevronRight` icon between them
   - Uses a repeating CSS chevron/stripe background pattern (diagonal stripes via `background-image: repeating-linear-gradient(...)`) for the hazard/conveyor feel
   - Highlights the active stage with a brighter text color or underline
   - Uses `grid-cols-8` matching the columns below so stage names align directly above their respective columns

3. **`src/index.css`** -- Add a subtle repeating chevron/stripe background utility if needed for the banner pattern.

### Visual Details
- Banner background: slightly darker than page background with diagonal stripe pattern (like a subtle conveyor belt)
- Arrow icons: `ChevronRight` from lucide-react between each stage name
- Active stage: highlighted with primary color
- Font: small, uppercase, muted -- functional not decorative
- Height: approximately 32-36px, compact

