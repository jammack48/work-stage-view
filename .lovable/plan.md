

## Fix Week View + Supplier Receipt Photos + Pipeline Review

### Issues Found

1. **Week view broken**: When `viewMode === "week"` on mobile, code falls through to `TimeGridMobile` which only shows a single day — no week grid rendered.
2. **Supplier receipt photo**: Currently just a toggle button text change. Need actual photo upload placeholder with visual feedback.
3. **Pipeline walkthrough**: The "Complete Job" button label should say "Finished Job" per user's earlier request. The completion flow step order and naming is mostly good but the "Coming Back?" step should come after work documentation (job sheet, time, parts) since you don't know if you're coming back until you've reviewed what was done.

### Changes

**1. Fix week view (`src/pages/WorkHome.tsx`)**
- Week view should always use `TimeGridDesktop` regardless of mobile/desktop — it's the only component that renders a 5-column week grid
- Remove the `isMobile` conditional inside week view branch

**2. Supplier receipt photos (`src/components/job/JobCompletionFlow.tsx`)**
- Replace the tiny "Receipt" toggle button with a proper photo card: dashed border box with camera icon, shows "Receipt Added ✓" with green styling when toggled
- Add a count/visual indicator for attached receipts in the supplier section
- Add a dedicated "Attach Paperwork" button per supplier item that's more prominent and thumb-friendly

**3. Reorder completion steps (`src/components/job/JobCompletionFlow.tsx`)**
- Move "Coming Back?" from step 1 to after parts/PO — logical order: jobsheet → time → parts → po-review → return → photos → compliance
- Rename button from "Complete Job" to "Finished Job" to match user language

**4. Minor pipeline fixes**
- The `WorkJobCard` "Complete Job" button text → "Finished Job"

### Files

| File | Change |
|------|--------|
| `src/pages/WorkHome.tsx` | Fix week view to always use TimeGridDesktop |
| `src/components/job/JobCompletionFlow.tsx` | Reorder steps, improve supplier receipt UI |
| `src/components/job/WorkJobCard.tsx` | Rename button to "Finished Job" |

