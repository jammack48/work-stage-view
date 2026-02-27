import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { dummyTemplates } from "@/data/dummyTemplates";
import type { PipelineStep } from "@/data/dummySequences";

interface FollowUpSequenceBuilderProps {
  category: "quotes" | "invoices" | "reviews";
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
        <div key={step.id} className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Step #{i + 1}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeStep(step.id)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Select value={step.channel} onValueChange={(v) => updateStep(step.id, "channel", v as "email" | "sms")}>
            <SelectTrigger className="text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>

          <Select value={step.templateId} onValueChange={(v) => updateStep(step.id, "templateId", v)}>
            <SelectTrigger className="text-sm h-9">
              <SelectValue placeholder="Select template…" />
            </SelectTrigger>
            <SelectContent>
              {getTemplates(step.channel).map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">after</span>
            <Input
              type="number"
              min={0}
              value={step.delayValue}
              onChange={(e) => updateStep(step.id, "delayValue", parseInt(e.target.value) || 0)}
              className="w-16 h-9 text-sm text-center"
            />
            <Select value={step.delayUnit} onValueChange={(v) => updateStep(step.id, "delayUnit", v as "hours" | "days")}>
              <SelectTrigger className="text-sm h-9 w-24 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">hours</SelectItem>
                <SelectItem value="days">days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground" onClick={addStep}>
        <Plus className="h-3.5 w-3.5" /> Add Step
      </Button>
    </div>
  );
}
