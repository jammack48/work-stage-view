

## Fix: CSV Import targeting wrong database and wrong tables

### Root Cause (3 issues)

1. **Wrong Supabase client** — The import service uses `import { supabase } from "@/integrations/supabase/client"` which is **Lovable Cloud**, not your external Supabase where `customers_prod` lives.

2. **Wrong table name** — It inserts into `"customers"` but your external database table is `customers_prod`.

3. **Non-existent tables** — It also inserts into `"customer_contacts"` and `"customer_addresses"` which don't exist in your external database. The `customers_prod` table likely has flat columns for email, phone, address — not separate relational tables.

### Fix

**File: `src/services/customerImportService.ts`**

1. Change the import from Lovable Cloud client to the external Supabase client:
   ```ts
   import { supabase } from "@/lib/supabase";
   ```

2. Change the insert target from `"customers"` to `"customers_prod"` and map columns to match `customers_prod` schema (which based on `customers_demo` likely uses: `name`, `email`, `phone`, `address`, `status`, `jobs`, `total_spend`, `notes`, `contacts`, `job_history`).

3. Remove the separate `customer_contacts` and `customer_addresses` inserts. Instead, store contacts and addresses as JSON in the `contacts` column of `customers_prod`, and build the flat `address` field from the primary address.

4. The insert would become:
   ```ts
   await supabase
     .from("customers_prod")
     .insert({
       name,
       email: primaryEmail ?? "",
       phone: primaryPhone ?? "",
       address: primaryAddress ? [primaryAddress.line1, primaryAddress.suburb, primaryAddress.city, primaryAddress.postcode].filter(Boolean).join(", ") : "",
       status: "active",
       contacts: JSON.stringify(contacts),
     })
     .select("id")
     .single();
   ```

5. Remove the `customer_contacts` and `customer_addresses` insert blocks entirely.

### Files changed
- `src/services/customerImportService.ts` — switch client, fix table name, flatten insert

