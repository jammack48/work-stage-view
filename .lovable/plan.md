

## Job Checklists Feature — Arrive on Site + Finish Job

### What the user wants
Field staff should be able to run through **pre-built checklists** when arriving on site or finishing a job. These checklists are created in the Office app (custom forms) and appear in the Work app. Example: "Switchboard Checklist" with tick items like "Clean up", "Tested", "Fire sealant used", "No gaps", "Tests done".

### Design

**Two trigger points in the Work app job card:**
1. **"Arrived on Site"** button — opens a checklist picker, then the selected checklist with tick items
2. **Finish Job flow** — adds a new "Checklist" step before the final submission where the worker picks and completes a relevant checklist

**Checklist data** (dummy/static for now):
- A set of checklist templates stored in a new data file, each with a category ("arrival" | "completion" | "both"), a name, and an array of tick items
- Examples: "Site Safety Arrival Checklist", "Switchboard Completion Checklist", "General Completion Checklist"

**UI flow:**
1. Tap "Arrived on Site" or reach the checklist step in completion flow
2. A dialog/sheet shows available checklists filtered by category
3. Tap a checklist to open it — shows the name, all items as checkboxes, and a "Complete" button
4. Items turn green when ticked; "Complete" is enabled when all mandatory items are checked
5. Completed checklists show as done in the FormsTab on the job card

### Files to create/change

1. **`src/data/dummyChecklists.ts`** — New file with checklist template data (5-6 templates with 4-8 items each, categorised as arrival/completion/both)

2. **`src/components/job/ChecklistDialog.tsx`** — New component: a dialog that shows checklist picker then the interactive tick-box checklist. Props: `open`, `onOpenChange`, `category` filter, `onComplete` callback

3. **`src/components/job/WorkJobCard.tsx`** — Add an "Arrived on Site" button next to the existing "Finished Job" button. Wire it to open the ChecklistDialog with category="arrival". Also update FormsTab to show completed checklists

4. **`src/components/job/JobCompletionFlow.tsx`** — Add a "Checklist" step (between Photos and Compliance) that lets the worker pick and complete a finish-job checklist inline

5. **`src/components/job/SoleTraderCloseOutFlow.tsx`** — Same: add a "Checklist" step in the appropriate position

6. **`src/components/job/FormsTab.tsx`** — Accept optional `completedChecklists` prop to display checklists that have been ticked off during arrival/completion

