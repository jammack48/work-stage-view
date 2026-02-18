import { AlertTriangle, X } from "lucide-react";
import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";

interface ExpandedStagePanelProps {
  stage: string;
  jobs: Job[];
  onClose: () => void;
}

function getStatusDot(job: Job): string {
  if (job.urgent) return "bg-[hsl(var(--status-red))]";
  if (job.ageDays > 14) return "bg-[hsl(var(--status-orange))]";
  return "bg-[hsl(var(--status-green))]";
}

export function ExpandedStagePanel({ stage, jobs, onClose }: ExpandedStagePanelProps) {
  return (
    <div className="animate-fade-in bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-base font-bold text-card-foreground flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          {stage}
          <span className="text-muted-foreground font-normal text-sm">
            ({jobs.length} jobs)
          </span>
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_1fr_100px_80px_70px] gap-4 px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <span className="w-3" />
        <span>Client</span>
        <span>Job</span>
        <span className="text-right">Value</span>
        <span className="text-right">Age</span>
        <span className="text-right">ID</span>
      </div>

      {/* Job rows — info left to right like Fergus */}
      <div className="divide-y divide-border/30">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-[auto_1fr_1fr_100px_80px_70px] gap-4 px-5 py-3 items-center hover:bg-accent/30 transition-colors text-sm"
          >
            {/* Status dot */}
            <span className={cn("w-3 h-3 rounded-full shrink-0", getStatusDot(job))} />

            {/* Client */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-card-foreground truncate">{job.client}</span>
              {job.urgent && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
            </div>

            {/* Job name */}
            <span className="text-muted-foreground truncate">{job.jobName}</span>

            {/* Value */}
            <span className="text-right font-semibold text-card-foreground">
              ${job.value.toLocaleString()}
            </span>

            {/* Age */}
            <span className="text-right text-muted-foreground">{job.ageDays}d ago</span>

            {/* ID */}
            <span className="text-right font-mono text-muted-foreground text-xs">{job.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
