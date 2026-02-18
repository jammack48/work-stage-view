import { AlertTriangle } from "lucide-react";
import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";

const stageColorMap: Record<string, string> = {
  Lead: "bg-[hsl(var(--stage-lead))]",
  "To Quote": "bg-[hsl(var(--stage-to-quote))]",
  "Quote Sent": "bg-[hsl(var(--stage-quote-sent))]",
  "Quote Accepted": "bg-[hsl(var(--stage-quote-accepted))]",
  "In Progress": "bg-[hsl(var(--stage-in-progress))]",
  "To Invoice": "bg-[hsl(var(--stage-to-invoice))]",
  Invoiced: "bg-[hsl(var(--stage-invoiced))]",
  "Invoice Paid": "bg-[hsl(var(--stage-paid))]",
};

const stageTintMap: Record<string, string> = {
  Lead: "bg-[hsl(var(--stage-lead)/0.1)]",
  "To Quote": "bg-[hsl(var(--stage-to-quote)/0.1)]",
  "Quote Sent": "bg-[hsl(var(--stage-quote-sent)/0.1)]",
  "Quote Accepted": "bg-[hsl(var(--stage-quote-accepted)/0.1)]",
  "In Progress": "bg-[hsl(var(--stage-in-progress)/0.1)]",
  "To Invoice": "bg-[hsl(var(--stage-to-invoice)/0.1)]",
  Invoiced: "bg-[hsl(var(--stage-invoiced)/0.1)]",
  "Invoice Paid": "bg-[hsl(var(--stage-paid)/0.1)]",
};

interface StageColumnProps {
  stage: string;
  jobs: Job[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function StageColumn({ stage, jobs, isExpanded, onToggle }: StageColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col min-w-[150px] flex-1 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        stageTintMap[stage],
        isExpanded && "ring-2 ring-foreground/20"
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div
        className={cn(
          "px-3 py-3 flex items-center justify-between text-white font-bold text-sm",
          stageColorMap[stage]
        )}
      >
        <span className="truncate">{stage}</span>
        <span className="ml-1 bg-white/25 rounded-full px-2 py-0.5 text-xs font-semibold">
          {jobs.length}
        </span>
      </div>

      {/* Mini cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[320px]">
        {jobs.map((job) => (
          <MiniCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function MiniCard({ job }: { job: Job }) {
  return (
    <div className="bg-card rounded-lg px-2.5 py-2 shadow-sm text-xs space-y-0.5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-1">
        <span className="font-semibold text-card-foreground truncate">{job.client}</span>
        {job.urgent && <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--stage-invoiced))] shrink-0" />}
      </div>
      <p className="text-muted-foreground truncate">{job.jobName}</p>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="font-medium text-card-foreground">${job.value.toLocaleString()}</span>
        <div className="flex items-center gap-1.5">
          <span>{job.ageDays}d</span>
          <span className="opacity-50">{job.id}</span>
        </div>
      </div>
    </div>
  );
}
