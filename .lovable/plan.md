

## Fix: Servicing as Home Sidebar Tab (not separate route)

The `/servicing` route was removed from `App.tsx` but you're still navigating to it. The fix is to make Servicing a **sidebar tab view** inside the Index page — same as how Quotes and Invoices work (they're views within the home page, not separate routes).

### Changes

1. **`src/components/HomeSidebar.tsx`** — Add "Servicing" to the `HomeView` type and tabs array with Wrench icon (no `path`, so it stays in-app like Quotes/Invoices)

2. **`src/pages/Index.tsx`** — Add "servicing" to the `HomeView` type, and render `ServicingPage` content when `activeView === "servicing"`

3. **`src/pages/ServicingPage.tsx`** — Convert from standalone page to an embeddable component (remove its own header/back button since the home layout provides that)

This means clicking "Servicing" in the sidebar switches the main content area — same pattern as Pipeline, Quotes, Invoices — keeping all headers, sidebar, and layout intact.

