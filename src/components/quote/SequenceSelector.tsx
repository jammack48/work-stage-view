import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dummySequences, type SequencePipeline } from "@/data/dummySequences";
import { dummyTemplates } from "@/data/dummyTemplates";

interface SequenceSelectorProps {
  category: "quotes" | "invoices" | "reviews";
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function SequenceSelector({ category, selectedId, onSelect }: SequenceSelectorProps) {
  const pipelines = dummySequences.filter((s) => s.category === category);
  const selected = pipelines.find((p) => p.id === selectedId);

  const getTemplateName = (id: string) => dummyTemplates.find((t) => t.id === id)?.name || "Unknown";

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-card-foreground">Follow-up Sequence</h4>
      </div>
      <Select value={selectedId || "none"} onValueChange={(v) => onSelect(v === "none" ? null : v)}>
        <SelectTrigger className="text-sm h-9">
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {pipelines.map((p) => (
            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected && selected.steps.length > 0 && (
        <div className="space-y-1 pt-1">
          {selected.steps.map((s, i) => (
            <p key={s.id} className="text-xs text-muted-foreground">
              #{i + 1} {s.channel.toUpperCase()} — {getTemplateName(s.templateId)} — after {s.delayValue} {s.delayUnit}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
