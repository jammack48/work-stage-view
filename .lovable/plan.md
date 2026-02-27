

## Fix Quote Flow: Skip Redundant Steps and Mobile Layout Issues

### Problems Identified

1. **Customer → New Quote asks for customer again**: When clicking "New Quote" from a customer's QuotesTab, it navigates to `/quote/new` without passing customer info. The funnel then asks "Who is this quote for?" — redundant since the user is already viewing that customer.

2. **Lead → Create Quote also has no pre-fill**: LeadActionMenu navigates to `/quote/{job.id}` which loads an existing job, but doesn't pre-fill customer data for new quotes either.

3. **Multiple entry points don't pass context**: Dashboard "New Quote" box and customer QuotesTab both go to `/quote/new` without customer data.

4. **Mobile layout issues in QuoteTab**: The ItemRow component has horizontal input rows (Qty × Buy → Sell, Markup) that overflow on narrow screens. The preview dialog presets also wrap awkwardly.

### Plan

**1. Pass customer data via navigation state (3 files)**

- **`src/components/customer/QuotesTab.tsx`**: Change navigate to pass customer object in location state:
  ```
  navigate("/quote/new", { state: { customer } })
  ```

- **`src/pages/QuotePage.tsx`**: Read `location.state?.customer` and pass it to `QuoteFunnel` as an `initialCustomer` prop. If provided, the funnel skips step 1 and pre-fills the address.

- **`src/components/quote/QuoteFunnel.tsx`**: Add `initialCustomer?: Customer` prop. If provided:
  - Start at step 2 (address) instead of step 1
  - Pre-fill `customer` and `address` from the initial customer
  - Update StepIndicator to show step 1 as already complete
  - "Back" from step 2 still allows going to step 1 to change customer if needed

**2. Fix mobile layout in QuoteTab (1 file)**

- **`src/components/job/QuoteTab.tsx`**: 
  - Wrap the Qty/Buy/Sell input row in `flex-wrap` so inputs stack on very narrow screens
  - Make input widths responsive (`w-14` → `min-w-[3rem] flex-1`)
  - Ensure the "Add another" section and bundle Select don't overflow

**3. Fix mobile preview presets (1 file)**

- **`src/components/quote/QuotePreview.tsx`**:
  - Make preset buttons use smaller text and wrap properly on mobile
  - Ensure the dialog content doesn't overflow the viewport

### Files to modify
- `src/components/customer/QuotesTab.tsx` — pass customer in nav state
- `src/pages/QuotePage.tsx` — read customer from nav state, pass to funnel
- `src/components/quote/QuoteFunnel.tsx` — accept initialCustomer, skip step 1
- `src/components/job/QuoteTab.tsx` — mobile-friendly input layout
- `src/components/quote/QuotePreview.tsx` — mobile preset button wrapping

