import { supabase } from "@/lib/supabase";

export interface MaterialItem {
  name: string;
  qty: number;
  unit: string;
  unitCost: number;
}

export interface LabourItem {
  description: string;
  hours: number;
  rate: number;
}

export interface Variation {
  id: string;
  job_id: string;
  description: string;
  value: number;
  status: "Pending" | "Approved" | "Rejected";
  materials: MaterialItem[];
  labour: LabourItem[];
  created_at: string;
}

export type VariationInsert = Omit<Variation, "id" | "created_at">;

const STORAGE_KEY = "tradie-toolbelt:variations";

function rowToVariation(r: any): Variation {
  return {
    id: r.id,
    job_id: r.job_id,
    description: r.description,
    value: Number(r.value ?? 0),
    status: r.status ?? "Pending",
    materials: (r.materials ?? []) as MaterialItem[],
    labour: (r.labour ?? []) as LabourItem[],
    created_at: r.created_at,
  };
}

function isMissingVariationsTableError(error: any): boolean {
  const message = String(error?.message ?? "").toLowerCase();
  return message.includes("public.variations") || (message.includes("variations") && message.includes("schema cache"));
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readLocalVariations(): Variation[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(rowToVariation);
  } catch {
    return [];
  }
}

function writeLocalVariations(variations: Variation[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(variations));
}

export async function fetchVariations(jobId: string): Promise<Variation[]> {
  const { data, error } = await (supabase as any)
    .from("variations")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (!error) {
    return (data ?? []).map(rowToVariation);
  }

  if (!isMissingVariationsTableError(error)) {
    throw new Error("Failed to fetch variations: " + error.message);
  }

  return readLocalVariations()
    .filter((variation) => variation.job_id === jobId)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function addVariation(v: VariationInsert): Promise<Variation> {
  const payload = {
    job_id: v.job_id,
    description: v.description,
    value: v.value,
    status: v.status,
    materials: v.materials,
    labour: v.labour,
  };

  const { data, error } = await (supabase as any)
    .from("variations")
    .insert(payload)
    .select("*")
    .single();

  if (!error) {
    return rowToVariation(data);
  }

  if (!isMissingVariationsTableError(error)) {
    throw new Error("Failed to add variation: " + error.message);
  }

  const localVariation: Variation = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...payload,
  };
  const existing = readLocalVariations();
  writeLocalVariations([localVariation, ...existing]);
  return localVariation;
}

export async function updateVariationStatus(
  id: string,
  status: Variation["status"]
): Promise<void> {
  const { error } = await (supabase as any)
    .from("variations")
    .update({ status })
    .eq("id", id);

  if (!error) {
    return;
  }

  if (!isMissingVariationsTableError(error)) {
    throw new Error("Failed to update variation: " + error.message);
  }

  const existing = readLocalVariations();
  writeLocalVariations(existing.map((variation) => (variation.id === id ? { ...variation, status } : variation)));
}

export async function deleteVariation(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from("variations")
    .delete()
    .eq("id", id);

  if (!error) {
    return;
  }

  if (!isMissingVariationsTableError(error)) {
    throw new Error("Failed to delete variation: " + error.message);
  }

  const existing = readLocalVariations();
  writeLocalVariations(existing.filter((variation) => variation.id !== id));
}
