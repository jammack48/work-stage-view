

## Dual Pipeline View: Simple + Advanced

### What This Does
Adds a Simple/Advanced toggle to the pipeline dashboard. Simple mode shows 4 clean columns (New, Quoted, Won, Done) mapped from the existing 8 stages. Advanced mode is the current pipeline, untouched. Same data, different lens.

### Stage Mapping

```text
Simple Column  →  Existing Stages
─────────────────────────────────────
New            →  Lead, To Quote
Quoted         →  Quote Sent
Won            →  Quote Accepted, In Progress
Done           →  To Invoice, Invoiced, Invoice Paid
```

### Drag-and-Drop Defaults
When a job is dropped into a simple column, it gets assigned a default stage:
- **New** → `Lead`
- **Quoted** → `Quote Sent`
- **Won** → `Quote Accepted`
- **Done** → `Invoice Paid`

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/SimplePipeline.tsx` | 4-column board with drag-and-drop, mobile swipe via Embla, job cards showing client/job/value + small status badge of real stage |
| `src/components/AdvancedPipeline.tsx` | Thin wrapper extracting all current Index.tsx pipeline rendering (horizontal/vertical/mobile) |
| `src/lib/simplePipelineMapping.ts` | Stage-to-bucket mapping, drop-target-to-stage defaults, types |

### Files to Modify

| File | Change |
|------|---------|
| `src/pages/Index.tsx` | Add Simple/Advanced toggle (persisted in localStorage), render `<SimplePipeline />` or `<AdvancedPipeline />` based on mode |
| `src/contexts/DemoDataContext.tsx` | No changes needed — `updateJobStage` already exists |

### SimplePipeline Component Design
- 4 columns, each with a header showing bucket name + job count
- Uses HTML5 drag-and-drop (lightweight, no library needed)
- Each card: client name, job name, value, small badge showing real stage (e.g. "In Progress" inside the Won column)
- Clicking a card navigates to job/quote/invoice based on stage (reuses existing routing logic)
- Mobile: horizontal swipe with Embla (same pattern as current mobile pipeline)
- Drop handler calls `updateJobStage(jobId, defaultStageForBucket)`

### Toggle UI
- Placed in the pipeline heading area (where layout toggle currently lives)
- Two-button segmented control: "Simple" | "Advanced"
- Mode saved to `localStorage` key `pipeline-mode`
- Default: `simple`

### What Does NOT Change
- All job detail views (notes, photos, materials, timesheets, variations)
- Database schema
- Advanced pipeline logic
- Backend endpoints
- Existing stage definitions

