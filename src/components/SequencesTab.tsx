import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FollowUpSequenceBuilder } from "@/components/FollowUpSequenceBuilder";
import { dummySequences, type SequencePipeline, type PipelineStep } from "@/data/dummySequences";
import { dummyTemplates } from "@/data/dummyTemplates";

interface SequencesTabProps {
  category: "quotes" | "invoices" | "reviews";
}

export function SequencesTab({ category }: SequencesTabProps) {
  const [pipelines, setPipelines] = useState<SequencePipeline[]>(
    dummySequences.filter((s) => s.category === category)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSteps, setEditSteps] = useState<PipelineStep[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditName("");
    setEditSteps([]);
  };

  const startEdit = (p: SequencePipeline) => {
    setIsCreating(false);
    setEditingId(p.id);
    setEditName(p.name);
    setEditSteps([...p.steps]);
  };

  const save = () => {
    if (!editName.trim()) return;
    if (isCreating) {
      const newPipeline: SequencePipeline = {
        id: crypto.randomUUID(),
        name: editName.trim(),
        category,
        steps: editSteps,
      };
      setPipelines([...pipelines, newPipeline]);
    } else if (editingId) {
      setPipelines(pipelines.map((p) => p.id === editingId ? { ...p, name: editName.trim(), steps: editSteps } : p));
    }
    cancel();
  };

  const cancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setEditName("");
    setEditSteps([]);
  };

  const remove = (id: string) => {
    setPipelines(pipelines.filter((p) => p.id !== id));
  };

  const getTemplateName = (id: string) => dummyTemplates.find((t) => t.id === id)?.name || "Unknown";

  const isEditing = isCreating || editingId !== null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-card-foreground mb-1">Saved Sequences</h3>
        <p className="text-sm text-muted-foreground">
          Create reusable follow-up pipelines mixing SMS and Email. Assign them to individual quotes or invoices.
        </p>
      </div>

      {/* Saved pipeline cards */}
      {pipelines.filter((p) => p.id !== editingId).map((p) => (
        <div key={p.id} className="rounded-lg border border-border bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-card-foreground">{p.name}</h4>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(p)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            {p.steps.map((s, i) => (
              <p key={s.id} className="text-xs text-muted-foreground">
                #{i + 1} {s.channel.toUpperCase()} — {getTemplateName(s.templateId)} — {s.delayValue} {s.delayUnit}
              </p>
            ))}
            {p.steps.length === 0 && <p className="text-xs text-muted-foreground italic">No steps</p>}
          </div>
        </div>
      ))}

      {/* Editing / Creating form */}
      {isEditing && (
        <div className="rounded-lg border-2 border-primary/30 bg-card p-4 space-y-3">
          <Input
            placeholder="Sequence name…"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-9 text-sm font-medium"
          />
          <FollowUpSequenceBuilder category={category} steps={editSteps} onStepsChange={setEditSteps} />
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="h-8 gap-1 text-xs" onClick={save}>
              <Check className="h-3.5 w-3.5" /> Save
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={cancel}>
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {!isEditing && (
        <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={startCreate}>
          <Plus className="h-4 w-4" /> New Sequence
        </Button>
      )}
    </div>
  );
}
