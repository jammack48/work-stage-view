import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { dummyTemplates, type MessageTemplate } from "@/data/dummyTemplates";
import { dummySequences } from "@/data/dummySequences";
import { toast } from "@/hooks/use-toast";

interface BulkMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: "sms" | "email";
  customerCount: number;
}

export function BulkMessageDialog({ open, onOpenChange, channel, customerCount }: BulkMessageDialogProps) {
  const [templateId, setTemplateId] = useState("");
  const [attachSequence, setAttachSequence] = useState(false);
  const [sequenceId, setSequenceId] = useState("");

  const templates = dummyTemplates.filter((t) => t.channel === channel && t.isActive);
  const selectedTemplate = templates.find((t) => t.id === templateId);

  const handleSend = () => {
    toast({
      title: `Bulk ${channel.toUpperCase()} sent`,
      description: `Sent to ${customerCount} customer${customerCount > 1 ? "s" : ""}${attachSequence && sequenceId ? " with reminder sequence attached" : ""}.`,
    });
    setTemplateId("");
    setAttachSequence(false);
    setSequenceId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Bulk {channel === "sms" ? "SMS" : "Email"}</DialogTitle>
          <DialogDescription>To {customerCount} selected customer{customerCount > 1 ? "s" : ""}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Template</label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a template…" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name} ({t.category})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="rounded-lg bg-muted/50 border border-border p-3">
              {selectedTemplate.subject && (
                <p className="text-xs font-medium text-card-foreground mb-1">{selectedTemplate.subject}</p>
              )}
              <p className="text-xs text-muted-foreground whitespace-pre-line">{selectedTemplate.body}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Switch checked={attachSequence} onCheckedChange={setAttachSequence} />
            <span className="text-sm">Attach reminder sequence</span>
          </div>

          {attachSequence && (
            <Select value={sequenceId} onValueChange={setSequenceId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a sequence…" />
              </SelectTrigger>
              <SelectContent>
                {dummySequences.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.steps.length} steps)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!templateId} onClick={handleSend}>
            Send to {customerCount}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ScheduleReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerCount: number;
}

export function ScheduleReminderDialog({ open, onOpenChange, customerCount }: ScheduleReminderDialogProps) {
  const [sequenceId, setSequenceId] = useState("");

  const handleSchedule = () => {
    const seq = dummySequences.find((s) => s.id === sequenceId);
    toast({
      title: "Service reminder scheduled",
      description: `"${seq?.name}" scheduled for ${customerCount} customer${customerCount > 1 ? "s" : ""}.`,
    });
    setSequenceId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Service Reminder</DialogTitle>
          <DialogDescription>Auto-schedule recurring follow-ups for {customerCount} customer{customerCount > 1 ? "s" : ""}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Reminder Sequence</label>
            <Select value={sequenceId} onValueChange={setSequenceId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a sequence…" />
              </SelectTrigger>
              <SelectContent>
                {dummySequences.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — {s.steps.length} steps ({s.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sequenceId && (() => {
            const seq = dummySequences.find((s) => s.id === sequenceId);
            if (!seq) return null;
            return (
              <div className="rounded-lg bg-muted/50 border border-border p-3 space-y-1">
                {seq.steps.map((step, i) => (
                  <div key={step.id} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-card-foreground">{i + 1}.</span>
                    <span className="uppercase">{step.channel}</span>
                    <span>after {step.delayValue} {step.delayUnit}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!sequenceId} onClick={handleSchedule}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
