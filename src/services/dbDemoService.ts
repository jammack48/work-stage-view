import { supabase } from "@/lib/supabase";
import type { DemoCustomer } from "@/types/demoData";
import customersSeed from "@/demo-data/customers.json";

/** Map DB row → DemoCustomer */
function rowToCustomer(r: any): DemoCustomer {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone ?? "",
    email: r.email ?? "",
    address: r.address ?? "",
    jobs: r.jobs ?? 0,
    status: (r.status ?? "leads") as DemoCustomer["status"],
    totalSpend: Number(r.total_spend ?? 0),
    notes: (r.notes ?? []) as string[],
    contacts: (r.contacts ?? []) as DemoCustomer["contacts"],
    jobHistory: (r.job_history ?? []) as DemoCustomer["jobHistory"],
  };
}

/** Seed customers from JSON if table is empty */
async function seedCustomersIfEmpty(): Promise<void> {
  const { count, error } = await supabase
    .from("customers_demo")
    .select("id", { count: "exact", head: true });

  if (error) throw error;
  if ((count ?? 0) > 0) return;

  const rows = (customersSeed as unknown as DemoCustomer[]).map((c) => ({
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    jobs: c.jobs,
    status: c.status,
    total_spend: c.totalSpend,
    notes: c.notes,
    contacts: c.contacts,
    job_history: c.jobHistory,
  }));

  for (let i = 0; i < rows.length; i += 20) {
    const batch = rows.slice(i, i + 20);
    const { error: insertErr } = await supabase.from("customers_demo").insert(batch as any);
    if (insertErr) console.error("Seed customers error:", insertErr);
  }
}

/** Fetch all customers from the external Supabase, auto-seeding if empty */
export async function fetchCustomers(): Promise<DemoCustomer[]> {
  await seedCustomersIfEmpty();

  const { data, error } = await supabase
    .from("customers_demo")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error("Failed to fetch customers: " + error.message);
  return (data ?? []).map(rowToCustomer);
}

/** Add a new customer */
export async function dbAddCustomer(customer: Omit<DemoCustomer, "id">): Promise<DemoCustomer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      jobs: customer.jobs,
      status: customer.status,
      total_spend: customer.totalSpend,
      notes: customer.notes,
      contacts: customer.contacts,
      job_history: customer.jobHistory,
    })
    .select("*")
    .single();

  if (error) throw new Error("Failed to add customer: " + error.message);
  return rowToCustomer(data);
}

/** Update a customer */
export async function dbUpdateCustomer(id: number, updates: Partial<DemoCustomer>): Promise<void> {
  const dbUpdates: Record<string, any> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.address !== undefined) dbUpdates.address = updates.address;
  if (updates.jobs !== undefined) dbUpdates.jobs = updates.jobs;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.totalSpend !== undefined) dbUpdates.total_spend = updates.totalSpend;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.contacts !== undefined) dbUpdates.contacts = updates.contacts;
  if (updates.jobHistory !== undefined) dbUpdates.job_history = updates.jobHistory;

  const { error } = await supabase
    .from("customers")
    .update(dbUpdates)
    .eq("id", id);

  if (error) throw new Error("Failed to update customer: " + error.message);
}