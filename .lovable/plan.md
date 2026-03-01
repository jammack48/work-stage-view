

## Full CRM Search, Filters, Bulk Actions and Service Reminders

### What we are building

Transform the Customer Directory into a full CRM workspace with four major capabilities:

1. **Full-text keyword search** — searches across customer name, email, phone, address, notes, and job history names (e.g. searching "switchboard" finds Dave Thompson)
2. **Advanced filters** — filter by spend range, job count, status, and sort by name/spend/jobs
3. **Multi-select with bulk actions** — select multiple customers and send a bulk SMS or Email using existing templates, with an option to attach an automated reminder sequence
4. **Service reminder scheduling** — when sending a bulk message, optionally attach a recurring service reminder sequence (e.g. "Annual switchboard inspection due") that auto-schedules future follow-ups

### Changes

#### 1. `src/pages/Customers.tsx` — Major rewrite

- Add a search `Input` at the top with a Search icon; state `searchQuery` filters across all customer fields including `notes[]` and `jobHistory[].name` using case-insensitive matching
- Add a filter/sort row beneath search: dropdown for **Sort by** (Name, Spend, Jobs), toggle for **Min spend** (slider or input), **Min jobs** (input)
- Add multi-select mode: a "Select" toggle button; when active, each customer row gets a Checkbox; a floating action bar appears at the bottom showing "X selected" with **Send SMS**, **Send Email**, and **Schedule Reminder** buttons
- Send SMS/Email opens a dialog letting user pick a template from existing `dummyTemplates` (filtered by channel), preview the message, and confirm (toast confirmation since no backend)
- Schedule Reminder opens a dialog where user picks a sequence from `dummySequences` or creates a quick one-off reminder with delay and channel, then confirms (toast)

#### 2. `src/components/customer/CustomerSearchBar.tsx` — New file

- Reusable search input component with debounced filtering
- Accepts `onSearch(query: string)` callback

#### 3. `src/components/customer/CustomerFilters.tsx` — New file

- Sort-by select, min-spend input, min-jobs input in a compact horizontal row
- Collapsible on mobile (behind a Filter icon toggle)

#### 4. `src/components/customer/BulkActionBar.tsx` — New file

- Fixed bottom bar showing selected count and action buttons (Send SMS, Send Email, Schedule Reminder)
- Each button opens a Dialog with template/sequence picker

#### 5. `src/components/customer/BulkMessageDialog.tsx` — New file

- Dialog for bulk SMS/Email: channel selector, template dropdown (from `dummyTemplates`), preview area, optional "Attach reminder sequence" toggle that shows sequence picker, confirm button

#### 6. Data layer additions

- Add a `tags` field to the `Customer` interface (e.g. `["switchboard", "ac service"]`) for richer keyword matching — or simply search existing `notes` and `jobHistory.name` fields (simpler, no data change needed)
- Search implementation: combine all searchable text per customer into a single string and test against the query

