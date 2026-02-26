import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FollowUpSequenceBuilder, type SequenceStep } from "@/components/FollowUpSequenceBuilder";

interface SequenceSettingsSheetProps {
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

export function SequenceSettingsSheet({
  category,
  emailEnabled,
  onEmailEnabledChange,
  emailSteps,
  onEmailStepsChange,
  smsEnabled,
  onSmsEnabledChange,
  smsSteps,
  onSmsStepsChange,
}: SequenceSettingsSheetProps) {
  const hasSequences = emailEnabled || smsEnabled;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Settings className="h-4 w-4" />
          {hasSequences && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[340px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base">Follow-Up Sequences</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Email Sequence */}
          <div className="space-y-3 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <Switch id="sheet-email-seq" checked={emailEnabled} onCheckedChange={onEmailEnabledChange} />
              <Label htmlFor="sheet-email-seq" className="text-sm font-medium">Enable Email Sequence</Label>
            </div>
            {emailEnabled && (
              <FollowUpSequenceBuilder channel="email" category={category} steps={emailSteps} onStepsChange={onEmailStepsChange} />
            )}
          </div>

          {/* SMS Sequence */}
          <div className="space-y-3 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <Switch id="sheet-sms-seq" checked={smsEnabled} onCheckedChange={onSmsEnabledChange} />
              <Label htmlFor="sheet-sms-seq" className="text-sm font-medium">Enable SMS Sequence</Label>
            </div>
            {smsEnabled && (
              <FollowUpSequenceBuilder channel="sms" category={category} steps={smsSteps} onStepsChange={onSmsStepsChange} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
