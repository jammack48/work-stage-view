import { AlertTriangle, X } from "lucide-react";
import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";

interface ExpandedStagePanelProps {
  stage: string;
  jobs: Job[];
  onClose: () => void;
}

function getCardBorderColor(job: Job): string {
  if (job.urgent) return "border-l-[hsl(var(--status-red))]";
  if (job.ageDays > 14) return "border-l-[hsl(var(--status-orange))]";
  return "border-l-[hsl(var(--status-green))]";
}

function getCardGlow(job: Job): string {
  if (job.urgent) return "hover:shadow-[0_4px_20px_hsl(var(--status-red)/0.15)]";
  if (job.ageDays > 14) return "hover:shadow-[0_4px_20px_hsl(var(--status-orange)/0.1)]";
  return "hover:shadow-[0_4px_20px_hsl(var(--status-green)/0.1)]";
}

export function ExpandedStagePanel({ stage, jobs, onClose }: ExpandedStagePanelProps) {
  return (
    <div className="animate-fade-in bg-card rounded-xl shadow-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
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

      {/* Cards flowing left to right like Fergus */}
      <div className="flex flex-wrap gap-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={cn(
              "bg-secondary rounded-lg p-4 border-l-4 shadow-sm transition-all w-[240px]",
              "hover:scale-[1.02]",
              getCardBorderColor(job),
              getCardGlow(job)
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-bold text-sm text-card-foreground">{job.client}</p>
                <p className="text-sm text-muted-foreground">{job.jobName}</p>
              </div>
              {job.urgent && (
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
              <span className="font-bold text-sm text-card-foreground">
                ${job.value.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <span>{job.ageDays}d ago</span>
                <span className="font-mono opacity-60">{job.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
