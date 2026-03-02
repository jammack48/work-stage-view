

## App Summary and the "To Invoice" Problem

### What the app does today
Tradie Toolbelt is a mobile-first business OS for trade companies. It follows a linear pipeline: **Lead > To Quote > Quote Sent > Quote Accepted > In Progress > To Invoice > Invoiced > Invoice Paid**. Each stage has dedicated workspaces (Quote page, Job Card, Invoice page). Work Mode gives field staff a simplified view with a completion flow.

### The problem: "To Invoice" is a dead end
When a job hits **To Invoice**, the flow breaks. The user sees the stage on the pipeline but has to:
1. Open the job card
2. Navigate to the Invoice tab (buried among 11 tabs)
3. Manually create an invoice with no guided process
4. There's no reconciliation of parts/costs before invoicing
5. No review step to catch margin issues

Meanwhile, Fergus scatters this across separate pages (Job Summary, Financial Summary, Cost Report, Reconciliation, Purchase Orders) -- information overload with no sequential guidance.

**The completion flow for field staff (7 steps) is excellent UX. The office/management side has nothing equivalent for closing out a job financially.**

### The Plan: "Close Out" Flow for Management

Add a guided sequential flow triggered when a job moves to "To Invoice" (or manually from the Job Card). This mirrors the field staff completion flow but for the business side:

#### New Component: `JobCloseOutFlow` 
A stepped dialog/fullscreen flow with 5 steps:

**Step 1 — Review Job Sheet** (read-only summary)
- Auto-populated from the field staff's completion data: description, time logged, photos
- Quick glance: "Is this complete enough to invoice?"

**Step 2 — Reconcile Costs**
- Side-by-side: Quoted vs Actual (labour, materials, extras)
- Supplier invoices/receipts attached during completion flow shown here
- Flag margin issues (over budget highlighted in orange/red)
- Approve or adjust line items

**Step 3 — Review & Generate Invoice**
- Pre-filled invoice from reconciled costs
- Pick invoice template/sequence
- Edit scope text, add/remove lines
- Preview button (reuses existing QuotePreview)

**Step 4 — Send**
- Choose delivery: Email, SMS, or both
- Preview message with customer details
- One-tap send

**Step 5 — Done**
- Job auto-moves to "Invoiced" stage
- Summary card: Total invoiced, margin %, delivery confirmation
- Option to "Close & Next" (jump to next To Invoice job)

#### Changes required:

1. **`src/components/job/JobCloseOutFlow.tsx`** — New component, ~300 lines, reuses the stepped dialog pattern from `JobCompletionFlow.tsx` (progress dots, prev/next, step icons)

2. **`src/pages/JobCard.tsx`** — Add a prominent "Close Out Job" button when stage is "To Invoice", which opens the flow. Remove or demote the separate Invoice tab since it's now part of the flow.

3. **`src/components/ExpandedStagePanel.tsx`** — For "To Invoice" stage rows, add a "Close Out" quick action button that opens the flow directly from the pipeline

4. **`src/data/dummyJobDetails.ts`** — Add reconciliation mock data (quoted vs actual costs) to support the review step

5. **`src/components/StageColumn.tsx`** — For "To Invoice" cards, the card tap could open the close-out flow directly instead of the job card (or show it as an option)

#### Why this is better than Fergus
- **Sequential, not scattered**: One guided flow vs 6 separate pages
- **Context-aware**: Pre-fills everything from the job and completion data
- **Margin visibility**: Instant profit/loss check before invoicing
- **One-tap send**: No switching between invoice creation and email tools
- **"Close & Next"**: Batch through multiple jobs efficiently

