

## Servicing Feature

A new dedicated page at `/servicing` for managing automated service reminders tied to customers and jobs.

### What it does
1. **Service Reminders list** — shows all scheduled service reminders with customer name, service type (e.g. "Heat Pump Service"), due date, status (pending/sent/booked), and the template used (email/SMS)
2. **Create reminder flow** — when sending an invoice, option to "Set Service Reminder" choosing: service type keyword, reminder interval (3/6/12 months), and email/SMS template
3. **Job keyword search** — search all jobs by keyword (e.g. "heat pump") to bulk-create service reminders for matching past jobs
4. **Auto-create job** — "Book In" button on a reminder creates a job card in the pipeline at "In Progress" stage with the service description pre-filled
5. **Service reminder templates** — new "Service Reminder" templates added to both Email and SMS template pages

### Database

New `service_reminders` table on external Supabase:

```sql
CREATE TABLE public.service_reminders (
  id serial PRIMARY KEY,
  customer_id integer NOT NULL,
  customer_name text NOT NULL,
  job_id text,
  service_type text NOT NULL,
  interval_months integer NOT NULL DEFAULT 6,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',  -- pending | sent | booked
  channel text NOT NULL DEFAULT 'email',   -- email | sms
  template_id text,
  created_at timestamptz DEFAULT now(),
  notes text DEFAULT ''
);

ALTER TABLE public.service_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON public.service_reminders FOR ALL TO anon USING (true) WITH CHECK (true);
```

### Files to create
- **`src/pages/ServicingPage.tsx`** — main page with:
  - Summary cards (due soon, overdue, total active)
  - Filterable/searchable list of reminders with status badges
  - "Add Reminder" dialog: pick customer, service type, interval, channel, template
  - "Search Jobs" dialog: keyword search across all jobs → select matches → bulk-create reminders
  - "Book In" action on each reminder → auto-creates a job via `addJob()` and updates status to "booked"
- **`src/services/servicingService.ts`** — CRUD operations against `service_reminders` table on external Supabase

### Files to modify
- **`src/App.tsx`** — add `/servicing` route
- **`src/config/toolbarTabs.ts`** — add `SERVICING_EXTRAS` toolbar tabs and add servicing to `PIPELINE_EXTRAS` / `handleCommonTab`
- **`src/data/dummyTemplates.ts`** — add "Service Reminder" email and SMS templates with body like "Hi {{customer_name}}, your {{service_type}} is due for servicing. Would you like us to book you in? Reply YES or call us. — {{business_name}}"
- **`src/components/HomeSidebar.tsx`** — add Servicing nav item with Wrench icon, path `/servicing`
- **`src/contexts/DemoDataContext.tsx`** — no changes needed (uses separate service for DB access)

### Template additions
- **Email**: "Service Reminder" — "Hi {{customer_name}}, your {{service_type}} at {{job_address}} is due for its scheduled service. Would you like us to book you in? ..."
- **SMS**: "Service Reminder SMS" — "Hi {{customer_name}}, your {{service_type}} service is due. Want us to book you in? Reply YES or call. — {{business_name}}"

### New template variables
- `{{service_type}}` — added to existing `TEMPLATE_VARIABLES` array

