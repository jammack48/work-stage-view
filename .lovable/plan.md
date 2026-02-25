

## Fix: Quote Funnel Not Triggering from Pipeline

### The Problem

The "New Quote" action box in the pipeline navigates to `/job/new?stage=Quote Sent` — which opens the generic Job Card page with the full sidebar (Overview, Quote, Invoice, etc). It should navigate to `/quote/new` to trigger the guided quote funnel.

Similarly, clicking individual job cards in quote-related stages (Lead, To Quote, Quote Sent) navigates to `/job/:id` instead of `/quote/:id`.

### Changes

**1. `src/pages/Index.tsx` — Route action boxes correctly**

The action boxes currently all navigate to `/job/new?stage=...`. Change the routing so quote-related actions go to `/quote/new`:

- "New Quote" (Quote Sent stage) → navigate to `/quote/new`
- "Add Customer" (Lead stage) → keep as `/job/new?stage=Lead` or route to customers
- "New Job" (In Progress) → keep as `/job/new`
- "New Invoice" (To Invoice) → keep as `/job/new`

This is a single-line change in the `onClick` handler — instead of always navigating to `/job/new?stage=...`, check if the stage is quote-related and route to `/quote/new`.

**2. `src/components/ExpandedStagePanel.tsx` — Route job cards by stage**

Job cards in early pipeline stages (Lead, To Quote, Quote Sent) should navigate to `/quote/:id` instead of `/job/:id`. Later stages (In Progress, To Invoice, Paid) continue to `/job/:id`.

Single change: wrap the navigate call in a condition based on the stage prop.

**3. No other changes needed**

The `QuoteFunnel` component and `QuotePage` already handle the funnel flow correctly when navigated to `/quote/new`. The issue is purely that the pipeline buttons point to the wrong route.

### Summary

Two files, two small routing fixes. The funnel itself works — it just was never being reached because the pipeline always sent users to `/job/new`.

