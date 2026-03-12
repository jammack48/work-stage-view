import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Check, X, Clock, ChevronDown, ChevronUp, Package, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  fetchVariations,
  addVariation,
  updateVariationStatus,
  deleteVariation,
  type Variation,
  type MaterialItem,
  type LabourItem,
} from "@/services/variationsService";

interface VariationsTabProps {
  jobId: string;
}

const STATUS_STYLES: Record<Variation["status"], string> = {
  Pending: "bg-[hsl(var(--status-orange))]/20 text-[hsl(var(--status-orange))] border-[hsl(var(--status-orange))]/30",
  Approved: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))] border-[hsl(var(--status-green))]/30",
  Rejected: "bg-[hsl(var(--status-red))]/20 text-[hsl(var(--status-red))] border-[hsl(var(--status-red))]/30",
};

const STATUS_ICONS: Record<Variation["status"], React.ElementType> = {
  Pending: Clock,
  Approved: Check,
  Rejected: X,
};

function emptyMaterial(): MaterialItem {
  return { name: "", qty: 1, unit: "ea", unitCost: 0 };
}

function emptyLabour(): LabourItem {
  return { description: "", hours: 1, rate: 0 };
}

function calcTotal(materials: MaterialItem[], labour: LabourItem[]): number {
  const matTotal = materials.reduce((s, m) => s + m.qty * m.unitCost, 0);
  const labTotal = labour.reduce((s, l) => s + l.hours * l.rate, 0);
  return matTotal + labTotal;
}

export function VariationsTab({ jobId }: VariationsTabProps) {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [desc, setDesc] = useState("");
  const [materials, setMaterials] = useState<MaterialItem[]>([emptyMaterial()]);
  const [labour, setLabour] = useState<LabourItem[]>([emptyLabour()]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchVariations(jobId);
      setVariations(data);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setDesc("");
    setMaterials([emptyMaterial()]);
    setLabour([emptyLabour()]);
    setShowForm(false);
  };

  const handleAdd = async () => {
    if (!desc.trim()) return;
    setSaving(true);
    try {
      const value = calcTotal(materials, labour);
      const v = await addVariation({
        job_id: jobId,
        description: desc.trim(),
        value,
        status: "Pending",
        materials: materials.filter((m) => m.name.trim()),
        labour: labour.filter((l) => l.description.trim()),
      });
      setVariations((prev) => [v, ...prev]);
      resetForm();
      toast({ title: "Variation added" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id: string, status: Variation["status"]) => {
    try {
      await updateVariationStatus(id, status);
      setVariations((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      toast({ title: `Variation ${status.toLowerCase()}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVariation(id);
      setVariations((prev) => prev.filter((v) => v.id !== id));
      toast({ title: "Variation deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const updateMaterial = (i: number, field: keyof MaterialItem, val: string | number) => {
    setMaterials((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));
  };

  const updateLabour = (i: number, field: keyof LabourItem, val: string | number) => {
    setLabour((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)));
  };

  const approvedTotal = variations.filter((v) => v.status === "Approved").reduce((s, v) => s + v.value, 0);
  const pendingTotal = variations.filter((v) => v.status === "Pending").reduce((s, v) => s + v.value, 0);

  if (loading) {
    return <div className="p-4 text-muted-foreground text-sm">Loading variations…</div>;
  }

  return (
    <div className="space-y-4 p-2">
      {/* Summary bar */}
      <div className="flex items-center gap-3 flex-wrap text-sm">
        <span className="font-semibold text-card-foreground">{variations.length} variation{variations.length !== 1 ? "s" : ""}</span>
        {approvedTotal > 0 && (
          <Badge variant="outline" className={STATUS_STYLES.Approved}>
            Approved ${approvedTotal.toLocaleString()}
          </Badge>
        )}
        {pendingTotal > 0 && (
          <Badge variant="outline" className={STATUS_STYLES.Pending}>
            Pending ${pendingTotal.toLocaleString()}
          </Badge>
        )}
        <Button size="sm" variant="outline" className="ml-auto gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5" /> Add
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-3">
          <Textarea
            placeholder="Describe the variation…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="min-h-[60px] text-sm"
          />

          {/* Materials */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Package className="w-3.5 h-3.5" /> Materials
            </div>
            {materials.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_60px_50px_80px_28px] gap-1.5 items-center">
                <Input placeholder="Item" value={m.name} onChange={(e) => updateMaterial(i, "name", e.target.value)} className="text-sm h-8" />
                <Input type="number" min={0} value={m.qty} onChange={(e) => updateMaterial(i, "qty", +e.target.value)} className="text-sm h-8" />
                <Input placeholder="ea" value={m.unit} onChange={(e) => updateMaterial(i, "unit", e.target.value)} className="text-sm h-8" />
                <Input type="number" min={0} step={0.01} value={m.unitCost} onChange={(e) => updateMaterial(i, "unitCost", +e.target.value)} className="text-sm h-8" placeholder="$" />
                <button onClick={() => setMaterials((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setMaterials((p) => [...p, emptyMaterial()])}>
              + material
            </Button>
          </div>

          {/* Labour */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Hammer className="w-3.5 h-3.5" /> Labour
            </div>
            {labour.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_60px_80px_28px] gap-1.5 items-center">
                <Input placeholder="Task" value={l.description} onChange={(e) => updateLabour(i, "description", e.target.value)} className="text-sm h-8" />
                <Input type="number" min={0} step={0.5} value={l.hours} onChange={(e) => updateLabour(i, "hours", +e.target.value)} className="text-sm h-8" placeholder="hrs" />
                <Input type="number" min={0} step={0.01} value={l.rate} onChange={(e) => updateLabour(i, "rate", +e.target.value)} className="text-sm h-8" placeholder="$/hr" />
                <button onClick={() => setLabour((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setLabour((p) => [...p, emptyLabour()])}>
              + labour
            </Button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-card-foreground">
              Total: ${calcTotal(materials, labour).toLocaleString()}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={resetForm}>Cancel</Button>
              <Button size="sm" onClick={handleAdd} disabled={saving || !desc.trim()}>
                {saving ? "Saving…" : "Save Variation"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {variations.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-8">No variations yet. Tap Add to create one.</p>
      )}

      {variations.map((v) => {
        const Icon = STATUS_ICONS[v.status];
        const expanded = expandedId === v.id;
        return (
          <div key={v.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpandedId(expanded ? null : v.id)}
              className="w-full flex items-center gap-2 p-3 text-left"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-sm font-medium text-card-foreground truncate">{v.description}</span>
              <span className="text-sm font-bold text-card-foreground">${v.value.toLocaleString()}</span>
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", STATUS_STYLES[v.status])}>
                {v.status}
              </Badge>
              {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {expanded && (
              <div className="border-t border-border p-3 space-y-3">
                {v.materials.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Package className="w-3 h-3" /> Materials</p>
                    {v.materials.map((m, i) => (
                      <div key={i} className="flex justify-between text-sm text-card-foreground">
                        <span>{m.name} × {m.qty} {m.unit}</span>
                        <span>${(m.qty * m.unitCost).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
                {v.labour.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Hammer className="w-3 h-3" /> Labour</p>
                    {v.labour.map((l, i) => (
                      <div key={i} className="flex justify-between text-sm text-card-foreground">
                        <span>{l.description} — {l.hours}h @ ${l.rate}/hr</span>
                        <span>${(l.hours * l.rate).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  {v.status !== "Approved" && (
                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => handleStatus(v.id, "Approved")}>
                      <Check className="w-3 h-3" /> Approve
                    </Button>
                  )}
                  {v.status !== "Rejected" && (
                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => handleStatus(v.id, "Rejected")}>
                      <X className="w-3 h-3" /> Reject
                    </Button>
                  )}
                  {v.status !== "Pending" && (
                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => handleStatus(v.id, "Pending")}>
                      <Clock className="w-3 h-3" /> Pending
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-xs h-7 gap-1 ml-auto text-destructive hover:text-destructive" onClick={() => handleDelete(v.id)}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
