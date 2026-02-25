

## Fix: Quote Funnel Missing Standard Layout + Pipeline Action Buttons

### Problem 1 — Quote Funnel has no standard layout

The `QuoteFunnel` component renders as a bare full-screen page with no `AppHeader` or `PageToolbar`. Every other page in the app follows the 4-layer structure (AppHeader → PageToolbar → Page Heading → Content). The funnel should too.

### Problem 2 — Pipeline toolbar lacks quick-action buttons

The pipeline page heading bar should include quick-create buttons (Add Customer, Add Quote, Add Invoice) so users can start key actions from anywhere on the pipeline without scrolling to find a specific stage's dashed action box.

---

### Changes

**1. `src/pages/QuotePage.tsx` — Wrap funnel in standard layout**

Instead of returning the bare `<QuoteFunnel />` component when `isNew && !funnelComplete`, wrap it in the same `AppHeader` + `PageToolbar` shell used after the funnel completes. The funnel content becomes the `children` of the PageToolbar, maintaining the standard layout.

- AppHeader stays at top
- PageToolbar renders with the same quote tabs (but the funnel content replaces tab content)
- Page heading shows "New Quote" with the step indicator
- The funnel steps render inside the content area, centered with `max-w-lg mx-auto`
- Tab buttons are still visible but disabled/dimmed during funnel (user can't jump to Line Items before completing the funnel)

**2. `src/components/quote/QuoteFunnel.tsx` — Remove outer layout wrapper**

Strip the `min-h-screen bg-background` and `max-w-lg mx-auto px-4 py-8` outer wrapper from the funnel. Move the step indicator into a heading that the parent page can use. The funnel becomes a pure content component that fits inside any container.

- Export the `StepIndicator` so the parent can place it in the page heading bar
- The funnel renders just the step content (customer list, address input, bundle cards) without its own page shell
- Keep `max-w-lg mx-auto` on the inner content for centering within the content area

**3. `src/pages/Index.tsx` — Add quick-action buttons to pipeline heading**

Add three compact buttons to the pipeline page heading bar (next to the layout toggle):
- **+ Customer** → navigates to `/customers` (or a future new-customer flow)
- **+ Quote** → navigates to `/quote/new`
- **+ Invoice** → navigates to `/job/new?stage=To+Invoice`

These appear as small pill buttons with a Plus icon, grouped together. On mobile they stack or scroll horizontally.

---

### Result

- `/quote/new` now shows AppHeader + PageToolbar + "New Quote" heading + funnel content — same shell as every other page
- Pipeline dashboard has quick-create actions visible in the heading bar at all times
- Consistent user flow across all pages

