import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FollowUpSequenceBuilder, type SequenceStep } from "@/components/FollowUpSequenceBuilder";

interface SequencesTabProps {
  category: "quotes" | "invoices";
  emailEnabled: boolean;
  onEmailEnabledChange: (v: boolean) => void;
  emailSteps: SequenceStep[];
  onEmailStepsChange: (steps: SequenceStep[]) => void;
  smsEnabled: boolean;
  onSmsEnabledChange: (v: boolean) => void;
  smsSteps: SequenceStep[];
  onSmsStepsChange: (steps: SequenceStep[]) => void;
}

export function SequencesTab({
  category,
  emailEnabled,
  onEmailEnabledChange,
  emailSteps,
  onEmailStepsChange,
  smsEnabled,
  onSmsEnabledChange,
  smsSteps,
  onSmsStepsChange,
}: SequencesTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-card-foreground mb-1">Follow-Up Sequences</h3>
        <p className="text-sm text-muted-foreground">
          Build automated follow-up pipelines using templates you've created. Each step sends after a set number of days.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Switch id="tab-email-seq" checked={emailEnabled} onCheckedChange={onEmailEnabledChange} />
          <Label htmlFor="tab-email-seq" className="text-sm font-medium">Enable Email Sequence</Label>
        </div>
        {emailEnabled && (
          <FollowUpSequenceBuilder channel="email" category={category} steps={emailSteps} onStepsChange={onEmailStepsChange} />
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Switch id="tab-sms-seq" checked={smsEnabled} onCheckedChange={onSmsEnabledChange} />
          <Label htmlFor="tab-sms-seq" className="text-sm font-medium">Enable SMS Sequence</Label>
        </div>
        {smsEnabled && (
          <FollowUpSequenceBuilder channel="sms" category={category} steps={smsSteps} onStepsChange={onSmsStepsChange} />
        )}
      </div>
    </div>
  );
}
