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

export async function fetchVariations(jobId: string): Promise<Variation[]> {
  const { data, error } = await (supabase as any)
    .from("variations")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch variations: " + error.message);
  return (data ?? []).map(rowToVariation);
}

export async function addVariation(v: VariationInsert): Promise<Variation> {
  const { data, error } = await (supabase as any)
    .from("variations")
    .insert({
      job_id: v.job_id,
      description: v.description,
      value: v.value,
      status: v.status,
      materials: v.materials,
      labour: v.labour,
    })
    .select("*")
    .single();

  if (error) throw new Error("Failed to add variation: " + error.message);
  return rowToVariation(data);
}

export async function updateVariationStatus(
  id: string,
  status: Variation["status"]
): Promise<void> {
  const { error } = await (supabase as any)
    .from("variations")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error("Failed to update variation: " + error.message);
}

export async function deleteVariation(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from("variations")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Failed to delete variation: " + error.message);
}
