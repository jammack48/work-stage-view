

## Problem

The `seedCustomersIfEmpty` function inserts rows with **explicit `id` values** (e.g., 1–8 from the JSON seed). This doesn't advance Postgres's `serial` sequence counter, so when a new customer is inserted (auto-increment), Postgres tries `id = 1` again → **duplicate key error (409/23505)**.

Additionally, after the insert fails, `addCustomer` returns `undefined`, so the navigation to the new customer card never fires.

## Fix

### Step 1: Fix the sequence in the external Supabase
After seeding, the serial sequence needs to be reset. Update `seedCustomersIfEmpty` in `dbDemoService.ts` to **not include explicit `id` values** in the insert — let Postgres auto-assign them. The seed JSON IDs aren't meaningful since `CustomerCard` looks up by DB-assigned ID.

Alternatively, remove `id` from the seed insert mapping so auto-increment handles it correctly.

### Step 2: Remove `id` from seed insert rows
In `dbDemoService.ts`, change the seed mapping to exclude `id`:

```typescript
const rows = (customersSeed as unknown as DemoCustomer[]).map((c) => ({
  name: c.name,
  phone: c.phone,
  // ... other fields, but NOT id
}));
```

### Step 3: Reset sequence on external DB (one-time)
You'll need to run this SQL on your external Supabase to fix the existing sequence:

```sql
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
```

This ensures the next auto-increment value is above the max existing ID.

### Files changed
- `src/services/dbDemoService.ts` — remove `id` from seed insert rows

