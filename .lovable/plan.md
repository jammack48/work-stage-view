

## Follow-Up Sequence Builder for Quotes and Invoices

### What Changes

Replace the current simple template dropdown selectors on the Quote page with a **follow-up sequence builder**. Instead of picking one template, users build a pipeline of follow-up steps — each step picks a template and sets a delay in days. This applies to both Email and SMS sequences, and will also be added to the Invoice/Job page.

### Location in the UI

On the Quote page (`line-items` tab), just below the "Send Quote" button:

1. **"Enable Email Sequence"** toggle (Switch component)
   - When enabled, shows a sequence builder:
     - Each step shows: template selector (from email/quotes templates) + days delay input + delete button
     - A `+` icon button at the bottom to add another step
     - Steps are numbered (Step 1, Step 2, etc.)
2. **"Enable SMS Sequence"** toggle (Switch component)
   - Same structure but uses SMS/quotes templates

Same pattern on the Invoice page for invoice follow-ups and overdue reminders.

### Files to Create

**`src/components/FollowUpSequenceBuilder.tsx`**

A reusable component that renders:
- A list of sequence steps, each with:
  - Select dropdown to pick a template (filtered by channel + category)
  - Number input for "days after send" (0 = immediately)
  - Delete (X) button per step
- A `+ Add Step` button (just a Plus icon) to append a new empty step
- Props: `channel: "email" | "sms"`, `category: string`, `steps`, `onStepsChange`

### Files to Modify

**`src/pages/QuotePage.tsx`**

- Remove the current email/SMS template Select dropdowns (lines 160-179)
- Add state for `emailSequenceEnabled`, `smsSequenceEnabled`, and their step arrays
- Below the "Send Quote" / "Save Draft" buttons area (rendered inside the `line-items` tab content), add:
  - Switch + label "Enable Email Sequence" 
  - When on: render `<FollowUpSequenceBuilder channel="email" category="quotes" />`
  - Switch + label "Enable SMS Sequence"
  - When on: render `<FollowUpSequenceBuilder channel="sms" category="quotes" />`

**`src/components/job/InvoiceTab.tsx`** (if it exists, otherwise note for future)

- Same pattern: enable email/SMS sequence toggles for invoice follow-ups using category "invoices" and "reminders"

### Data Shape

```typescript
interface SequenceStep {
  id: string;
  templateId: string;  // references a dummyTemplate id
  delayDays: number;   // 0 = immediately, 3 = after 3 days, etc.
}
```

### Visual Layout

```text
┌─────────────────────────────────────────┐
│ [Send Quote]              [Save Draft]  │
├─────────────────────────────────────────┤
│ ○ Enable Email Sequence                 │
│                                         │
│  Step 1: [Quote Ready      ▾] after [0] days
│  Step 2: [Quote Follow-up  ▾] after [3] days
│  [+ Add Step]                           │
│                                         │
│ ○ Enable SMS Sequence                   │
│                                         │
│  Step 1: [Quote Ready SMS  ▾] after [0] days
│  [+ Add Step]                           │
└─────────────────────────────────────────┘
```

### Files Summary

| File | Action |
|------|--------|
| `src/components/FollowUpSequenceBuilder.tsx` | Create — reusable sequence builder component |
| `src/pages/QuotePage.tsx` | Edit — replace template dropdowns with sequence toggles + builder |
| `src/components/job/InvoiceTab.tsx` | Edit — add sequence toggles for invoice follow-ups |

