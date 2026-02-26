import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { dummyTemplates } from "@/data/dummyTemplates";
import type { PipelineStep } from "@/data/dummySequences";

interface FollowUpSequenceBuilderProps {
  category: "quotes" | "invoices";
  steps: PipelineStep[];
  onStepsChange: (steps: PipelineStep[]) => void;
}

export function FollowUpSequenceBuilder({ category, steps, onStepsChange }: FollowUpSequenceBuilderProps) {
  const addStep = () => {
    onStepsChange([
      ...steps,
      { id: crypto.randomUUID(), channel: "sms", templateId: "", delayValue: steps.length === 0 ? 0 : 3, delayUnit: "days" },
    ]);
  };

  const removeStep = (id: string) => {
    onStepsChange(steps.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: keyof Omit<PipelineStep, "id">, value: string | number) => {
    onStepsChange(
      steps.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: value };
        // Reset templateId when channel changes
        if (field === "channel") updated.templateId = "";
        return updated;
      })
    );
  };

  const getTemplates = (channel: "email" | "sms") =>
    dummyTemplates.filter((t) => t.channel === channel && t.category === category && t.isActive);

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground w-10 shrink-0">#{i + 1}</span>

          <Select value={step.channel} onValueChange={(v) => updateStep(step.id, "channel", v as "email" | "sms")}>
            <SelectTrigger className="text-sm h-9 w-24 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>

          <Select value={step.templateId} onValueChange={(v) => updateStep(step.id, "templateId", v)}>
            <SelectTrigger className="text-sm h-9 flex-1 min-w-[140px]">
              <SelectValue placeholder="Select template…" />
            </SelectTrigger>
            <SelectContent>
              {getTemplates(step.channel).map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-muted-foreground shrink-0">after</span>
          <Input
            type="number"
            min={0}
            value={step.delayValue}
            onChange={(e) => updateStep(step.id, "delayValue", parseInt(e.target.value) || 0)}
            className="w-16 h-9 text-sm text-center"
          />
          <Select value={step.delayUnit} onValueChange={(v) => updateStep(step.id, "delayUnit", v as "hours" | "days")}>
            <SelectTrigger className="text-sm h-9 w-20 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">hours</SelectItem>
              <SelectItem value="days">days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeStep(step.id)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground" onClick={addStep}>
        <Plus className="h-3.5 w-3.5" /> Add Step
      </Button>
    </div>
  );
}
