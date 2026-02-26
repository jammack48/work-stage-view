

## Expand Customer Card Tabs

### Current State
Customer Card has 6 tabs: Overview, Jobs, Contacts, Notes, Spend, New Job.

### New Tabs to Add

1. **History** — Chronological timeline of all interactions: jobs created, quotes sent, invoices paid, notes added, contacts added. Generated from `jobHistory` data with dummy communication entries.

2. **Photos** — Gallery of photos aggregated from all customer jobs. Dummy placeholder images with job references.

3. **Documents** — List of documents (quotes, invoices, forms) saved across all jobs. Each entry shows document type, job reference, date, and status.

4. **Quotes** — List of all quotes for this customer (derived from jobHistory where stage includes "Quote" or "Lead"), with a "Create New Quote" button that navigates to `/quote/new`.

5. **Invoices** — List of all invoices for this customer (derived from jobHistory where stage includes "Invoice" or "Paid"), with a "Create New Invoice" button that navigates to `/invoice/new`.

### Changes

| File | Change |
|------|--------|
| `src/config/toolbarTabs.ts` | Update `CUSTOMER_CARD_EXTRAS` to add History, Photos, Documents, Quotes, Invoices tabs (icons: History, Camera, FileText, FilePlus, Receipt) |
| `src/pages/CustomerCard.tsx` | Add 5 new tab content sections: history timeline, photos grid, documents list, quotes list with "New Quote" button, invoices list with "New Invoice" button. Update `CustTab` type. |

### Tab Order in Toolbar
Back, Overview, Jobs, Quotes, Invoices, History, Photos, Documents, Contacts, Notes, Spend, New Job

