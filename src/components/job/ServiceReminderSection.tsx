import { useState } from "react";
import { Wrench, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SequenceSelector } from "@/components/quote/SequenceSelector";
import { cn } from "@/lib/utils";

interface ServiceReminderSectionProps {
  customerName: string;
  jobName: string;
}

const SERVICE_TYPES = [
  "Heat Pump Service",
  "Boiler Service",
  "Gas Appliance Service",
  "Plumbing Maintenance",
  "Drain Inspection",
  "Hot Water Cylinder Check",
  "General Maintenance",
];

const INTERVALS = [
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

export function ServiceReminderSection({ customerName, jobName }: ServiceReminderSectionProps) {
  const [enabled, setEnabled] = useState(false);
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [interval, setInterval] = useState("12");
  const [sequenceId, setSequenceId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5" /> Service Reminder
        </Label>
        <Switch checked={enabled} onCheckedChange={(v) => { setEnabled(v); if (v) setExpanded(true); }} />
      </div>

      {enabled && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-sm font-medium text-card-foreground"
          >
            <span>
              {serviceType} · every {INTERVALS.find((i) => i.value === interval)?.label}
            </span>
            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
          </button>

          {expanded && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Service Type</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Reminder Interval</Label>
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className="text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVALS.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <SequenceSelector category="invoices" selectedId={sequenceId} onSelect={setSequenceId} />

              <p className="text-xs text-muted-foreground">
                A reminder will be scheduled for {customerName} in {INTERVALS.find((i) => i.value === interval)?.label} for "{serviceType}".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
