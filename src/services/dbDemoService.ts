import { supabase } from "@/lib/supabase";
import type { DemoCustomer, DemoDataset, DemoJob } from "@/types/demoData";
import type { Stage } from "@/data/dummyJobs";
import jobsSeed from "@/demo-data/jobs.json";
import customersSeed from "@/demo-data/customers.json";
import materialsSeed from "@/demo-data/materials.json";
import scheduleSeed from "@/demo-data/schedule.json";

const SESSION_KEY = "demo_session_id";

function getSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function setSessionId(id: string) {
  localStorage.setItem(SESSION_KEY, id);
}

/** Map DB row → DemoJob */
function rowToJob(r: any): DemoJob {
  return {
    id: r.job_id,
    client: r.client,
    jobName: r.job_name,
    value: Number(r.value),
    ageDays: r.age_days,
    urgent: r.urgent,
    stage: r.stage as Stage,
    hasUnread: r.has_unread,
  };
}

/** Map DB row → DemoCustomer */
function rowToCustomer(r: any): DemoCustomer {
  return {
    id: r.customer_id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    address: r.address,
    jobs: r.jobs,
    status: r.status as DemoCustomer["status"],
    totalSpend: Number(r.total_spend),
    notes: r.notes as string[],
    contacts: r.contacts as DemoCustomer["contacts"],
    jobHistory: r.job_history as DemoCustomer["jobHistory"],
  };
}

/** Create a new session and seed it with demo data. Returns session id. */
export async function createSession(label = ""): Promise<string> {
  const { data, error } = await supabase
    .from("demo_sessions")
    .insert({ label })
    .select("id")
    .single();
  if (error || !data) throw new Error("Failed to create session: " + error?.message);

  const sessionId = data.id;

  // Seed jobs
  const jobRows = (jobsSeed as unknown as DemoJob[]).map((j) => ({
    session_id: sessionId,
    job_id: j.id,
    client: j.client,
    job_name: j.jobName,
    value: j.value,
    age_days: j.ageDays,
    urgent: j.urgent,
    stage: j.stage,
    has_unread: j.hasUnread ?? false,
  }));

  // Insert in batches of 50
  for (let i = 0; i < jobRows.length; i += 50) {
    const batch = jobRows.slice(i, i + 50);
    const { error: je } = await supabase.from("demo_jobs").insert(batch);
    if (je) console.error("Seed jobs error:", je);
  }

  // Seed customers
  const custRows = (customersSeed as unknown as DemoCustomer[]).map((c) => ({
    session_id: sessionId,
    customer_id: c.id,
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

  for (let i = 0; i < custRows.length; i += 50) {
    const batch = custRows.slice(i, i + 50);
    const { error: ce } = await supabase.from("demo_customers").insert(batch);
    if (ce) console.error("Seed customers error:", ce);
  }

  setSessionId(sessionId);
  return sessionId;
}

/** Ensure we have a valid session, creating one if needed */
export async function ensureSession(): Promise<string> {
  const existing = getSessionId();
  if (existing) {
    // Verify it still exists
    const { data } = await supabase
      .from("demo_sessions")
      .select("id")
      .eq("id", existing)
      .maybeSingle();
    if (data) return existing;
  }
  return createSession();
}

/** Fetch full dataset from DB */
export async function fetchDataset(sessionId: string): Promise<DemoDataset> {
  const [jobsRes, custsRes] = await Promise.all([
    supabase.from("demo_jobs").select("*").eq("session_id", sessionId),
    supabase.from("demo_customers").select("*").eq("session_id", sessionId),
  ]);

  return {
    jobs: (jobsRes.data ?? []).map(rowToJob),
    customers: (custsRes.data ?? []).map(rowToCustomer),
    materials: materialsSeed as any,
    schedule: scheduleSeed as any,
  };
}

/** Update a job's stage in the DB and return the updated dataset */
export async function dbUpdateJobStage(sessionId: string, jobId: string, stage: Stage): Promise<DemoDataset> {
  await supabase
    .from("demo_jobs")
    .update({ stage, age_days: 0 })
    .eq("session_id", sessionId)
    .eq("job_id", jobId);

  // Also update customer stats
  const dataset = await fetchDataset(sessionId);
  
  // Recompute customer stats based on updated jobs
  const updatedCustomers = dataset.customers.map((customer) => {
    const custJobs = dataset.jobs.filter((j) => j.client === customer.name);
    const jobsCount = custJobs.length;
    const totalSpend = custJobs
      .filter((j) => j.stage === "Invoice Paid")
      .reduce((sum, j) => sum + j.value, 0);
    const hasOpenLead = custJobs.some((j) => ["Lead", "To Quote"].includes(j.stage));
    const status: DemoCustomer["status"] = jobsCount === 0 ? "archived" : hasOpenLead ? "leads" : "active";

    const jobHistory = customer.jobHistory.map((h) =>
      h.id === jobId ? { ...h, stage } : h
    );

    return { ...customer, jobs: jobsCount, totalSpend, status, jobHistory };
  });

  // Batch update customers in DB
  for (const c of updatedCustomers) {
    await supabase
      .from("demo_customers")
      .update({
        jobs: c.jobs,
        total_spend: c.totalSpend,
        status: c.status,
        job_history: c.jobHistory,
      })
      .eq("session_id", sessionId)
      .eq("customer_id", c.id);
  }

  return { ...dataset, customers: updatedCustomers };
}

/** Add a new customer to the DB */
export async function dbAddCustomer(sessionId: string, customer: Omit<DemoCustomer, "id">): Promise<DemoDataset> {
  // Get max customer_id
  const { data: existing } = await supabase
    .from("demo_customers")
    .select("customer_id")
    .eq("session_id", sessionId)
    .order("customer_id", { ascending: false })
    .limit(1);

  const nextId = (existing?.[0]?.customer_id ?? 0) + 1;

  await supabase.from("demo_customers").insert({
    session_id: sessionId,
    customer_id: nextId,
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
  });

  return fetchDataset(sessionId);
}

/** Add a new job to the DB */
export async function dbAddJob(sessionId: string, job: { client: string; jobName: string; value: number; stage: Stage }): Promise<DemoDataset> {
  // Generate a unique job_id
  const { data: existing } = await supabase
    .from("demo_jobs")
    .select("job_id")
    .eq("session_id", sessionId)
    .order("id", { ascending: false })
    .limit(1);

  const lastNum = existing?.[0]?.job_id ? parseInt(existing[0].job_id.replace(/\D/g, ""), 10) : 0;
  const jobId = `JOB-${String(lastNum + 1).padStart(4, "0")}`;

  await supabase.from("demo_jobs").insert({
    session_id: sessionId,
    job_id: jobId,
    client: job.client,
    job_name: job.jobName,
    value: job.value,
    age_days: 0,
    urgent: false,
    stage: job.stage,
    has_unread: false,
  });

  // Also update the customer's job_history
  const { data: custRow } = await supabase
    .from("demo_customers")
    .select("*")
    .eq("session_id", sessionId)
    .eq("name", job.client)
    .maybeSingle();

  if (custRow) {
    const history = (custRow.job_history as any[]) || [];
    history.push({ id: jobId, name: job.jobName, value: job.value, stage: job.stage, date: new Date().toLocaleDateString("en-AU") });
    await supabase
      .from("demo_customers")
      .update({ job_history: history, jobs: (custRow.jobs || 0) + 1 })
      .eq("session_id", sessionId)
      .eq("customer_id", custRow.customer_id);
  }

  return fetchDataset(sessionId);
}

/** Reset a session — delete all data and re-seed */
export async function dbResetSession(sessionId: string): Promise<DemoDataset> {
  // Delete old data
  await Promise.all([
    supabase.from("demo_jobs").delete().eq("session_id", sessionId),
    supabase.from("demo_customers").delete().eq("session_id", sessionId),
  ]);

  // Re-seed
  const jobRows = (jobsSeed as unknown as DemoJob[]).map((j) => ({
    session_id: sessionId,
    job_id: j.id,
    client: j.client,
    job_name: j.jobName,
    value: j.value,
    age_days: j.ageDays,
    urgent: j.urgent,
    stage: j.stage,
    has_unread: j.hasUnread ?? false,
  }));

  for (let i = 0; i < jobRows.length; i += 50) {
    await supabase.from("demo_jobs").insert(jobRows.slice(i, i + 50));
  }

  const custRows = (customersSeed as unknown as DemoCustomer[]).map((c) => ({
    session_id: sessionId,
    customer_id: c.id,
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

  for (let i = 0; i < custRows.length; i += 50) {
    await supabase.from("demo_customers").insert(custRows.slice(i, i + 50));
  }

  return fetchDataset(sessionId);
}
