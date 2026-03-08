import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Stage } from "@/data/dummyJobs";

const STAGE_OPTIONS: { value: Stage; label: string; desc: string }[] = [
  { value: "Lead", label: "Lead", desc: "New enquiry to follow up" },
  { value: "To Quote", label: "Pricing/Quoting", desc: "Needs pricing or quoting" },
  { value: "Quote Sent", label: "Awaiting Acceptance", desc: "Quote sent, awaiting acceptance" },
  { value: "Quote Accepted", label: "Schedule Job", desc: "Quote accepted and ready to schedule" },
  { value: "In Progress", label: "Job In Progress", desc: "Job is underway" },
  { value: "To Invoice", label: "Ready To Invoice", desc: "Job done and ready for invoicing" },
  { value: "Invoiced", label: "Invoiced", desc: "Invoice sent, awaiting payment" },
];

interface NewJobDialogProps {
  customerName: string;
  customerAddress: string;
  onCreateJob: (job: { jobName: string; description: string; address: string; stage: Stage; value: number }) => void;
  trigger?: React.ReactNode;
}

export function NewJobDialog({ customerName, customerAddress, onCreateJob, trigger }: NewJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(customerAddress);
  const [stage, setStage] = useState<Stage>("Lead");
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobName.trim()) {
      toast.error("Job name is required");
      return;
    }
    onCreateJob({
      jobName: jobName.trim(),
      description: description.trim(),
      address: address.trim(),
      stage,
      value: parseFloat(value) || 0,
    });
    toast.success(`Job "${jobName}" created in ${stage}`);
    setOpen(false);
    setJobName("");
    setDescription("");
    setAddress(customerAddress);
    setStage("Lead");
    setValue("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-1.5">
            <Plus className="w-4 h-4" /> New Job
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Job for {customerName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobName">Job Name *</Label>
            <Input id="jobName" placeholder="e.g. Kitchen Renovation" value={jobName} onChange={(e) => setJobName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the work required..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Site Address</Label>
            <Input id="address" placeholder="Job site address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Pipeline Stage</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as Stage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGE_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex flex-col">
                      <span>{s.label}</span>
                      <span className="text-[10px] text-muted-foreground">{s.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Estimated Value ($)</Label>
            <Input id="value" type="number" min="0" step="0.01" placeholder="0.00" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create Job</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
