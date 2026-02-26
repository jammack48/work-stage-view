import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { dummyTemplates } from "@/data/dummyTemplates";

export interface SequenceStep {
  id: string;
  templateId: string;
  delayDays: number;
}

interface FollowUpSequenceBuilderProps {
  channel: "email" | "sms";
  category: string;
  steps: SequenceStep[];
  onStepsChange: (steps: SequenceStep[]) => void;
}

export function FollowUpSequenceBuilder({ channel, category, steps, onStepsChange }: FollowUpSequenceBuilderProps) {
  const templates = dummyTemplates.filter(
    (t) => t.channel === channel && t.category === category && t.isActive
  );

  const addStep = () => {
    onStepsChange([
      ...steps,
      { id: crypto.randomUUID(), templateId: "", delayDays: steps.length === 0 ? 0 : 3 },
    ]);
  };

  const removeStep = (id: string) => {
    onStepsChange(steps.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: keyof Omit<SequenceStep, "id">, value: string | number) => {
    onStepsChange(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="space-y-2 pl-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground w-12 shrink-0">Step {i + 1}</span>
          <Select value={step.templateId} onValueChange={(v) => updateStep(step.id, "templateId", v)}>
            <SelectTrigger className="text-sm h-9 flex-1">
              <SelectValue placeholder="Select template…" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground shrink-0">after</span>
          <Input
            type="number"
            min={0}
            value={step.delayDays}
            onChange={(e) => updateStep(step.id, "delayDays", parseInt(e.target.value) || 0)}
            className="w-16 h-9 text-sm text-center"
          />
          <span className="text-xs text-muted-foreground shrink-0">days</span>
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
