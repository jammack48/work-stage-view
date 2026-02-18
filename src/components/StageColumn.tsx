import { AlertTriangle } from "lucide-react";
import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";

function getStatusBorder(job: Job): string {
  if (job.urgent) return "border-l-[hsl(var(--status-red))]";
  if (job.ageDays > 14) return "border-l-[hsl(var(--status-orange))]";
  return "border-l-[hsl(var(--status-green))]";
}

interface StageColumnProps {
  stage: string;
  jobs: Job[];
  isExpanded: boolean;
  onToggle: () => void;
  layout?: "horizontal" | "vertical";
}

export function StageColumn({ stage, jobs, isExpanded, onToggle, layout = "horizontal" }: StageColumnProps) {
  const isVertical = layout === "vertical";

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        "bg-secondary/50 hover:bg-secondary/80",
        isExpanded && "ring-2 ring-primary/50 shadow-[0_0_20px_hsl(var(--glow-primary)/0.15)]",
        isVertical ? "min-w-[220px] w-full" : "min-w-[180px] flex-1"
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center justify-between bg-[hsl(var(--stage-header))] text-primary-foreground font-bold text-sm">
        <span className="truncate">{stage}</span>
        <span className="ml-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
          {jobs.length}
        </span>
      </div>

      {/* Mini job cards */}
      <div className={cn(
        "flex-1 p-2 flex flex-col gap-1.5 overflow-y-auto",
        isVertical ? "max-h-[300px]" : "max-h-[280px]"
      )}>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={cn(
              "rounded-md bg-card px-2.5 py-1.5 border-l-3 shadow-sm transition-transform hover:scale-[1.02] text-xs",
              getStatusBorder(job)
            )}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-semibold text-card-foreground truncate">{job.client}</span>
              {job.urgent && <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />}
            </div>
            <div className="text-muted-foreground truncate">{job.jobName}</div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-semibold text-card-foreground">${job.value.toLocaleString()}</span>
              <span className="text-muted-foreground">{job.ageDays}d</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
