

## Add Stages & Variations to Demo Job Card

### What we're building

Extend the existing demo `JobDetail` model with optional **Stages** (e.g., Prewire, Fit-off, Final) and **Variations** (scope changes attached to a stage or job). Display these in the Job Card as a new "Stages" tab showing a collapsible stage list with nested variations, materials, and labour per stage.

### Data Model Changes

**File: `src/data/dummyJobDetails.ts`**

Add new interfaces and seed data:

```typescript
interface JobStage {
  id: string;           // e.g. "01"
  name: string;         // e.g. "Prewire"
  quotedValue: number;
  status: "Pending" | "In Progress" | "Complete" | "Invoiced";
  materials: MaterialItem[];
  labour: TimeEntry[];
  variations: JobVariation[];
}

interface JobVariation {
  id: string;           // e.g. "V1"
  description: string;  // e.g. "Add outdoor socket"
  status: "Pending" | "Approved" | "Rejected";
  value: number;
  materials: MaterialItem[];
  labour: TimeEntry[];
}
```

Add `stages?: JobStage[]` and `variations?: JobVariation[]` to `JobDetail`. Stages are optional — service jobs have none (flat structure), project jobs have 2-4 stages.

Seed ~3 of the existing demo jobs as "project" jobs with stages and variations. The rest remain service jobs (unchanged).

**File: `src/types/demoData.ts`**

Add `jobType?: "service" | "project"` to `DemoJob`.

### New Component: StagesTab

**File: `src/components/job/StagesTab.tsx`**

A collapsible accordion showing each stage with:
- Stage header: number, name, quoted value, status badge
- Nested materials and labour summaries
- Variations section within each stage (collapsible)
- Each variation shows description, status (Pending/Approved/Rejected), value, and its own materials/labour

Display format uses the naming convention: `JOB-5523-01` for stages, `JOB-5523-01V1` for variations.

For jobs without stages, show a message: "This is a service job — no stages required."

### Job Card Integration

**File: `src/config/toolbarTabs.ts`**

Add `{ id: "stages", label: "Stages", icon: Layers }` to `JOB_EXTRAS` (after overview).

**File: `src/pages/JobCard.tsx`**

- Import `StagesTab`, add to `tabContent` map
- Pass `job.stages` and job ID to the tab

**File: `src/components/job/OverviewTab.tsx`**

Add a small "Stages" summary card (4th card in the grid) for project jobs showing stage count and progress (e.g., "2/3 complete"). Hidden for service jobs.

### What stays unchanged
- All existing tabs, demo data paths, pipeline, schedule
- Service jobs behave exactly as before
- No authentication, no database changes

