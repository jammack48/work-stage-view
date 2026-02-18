import { AlertTriangle } from "lucide-react";
import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";

function getStatusColor(job: Job): string {
  if (job.urgent) return "border-l-[hsl(var(--status-red))] bg-[hsl(var(--status-red)/0.06)]";
  if (job.ageDays > 14) return "border-l-[hsl(var(--status-orange))] bg-[hsl(var(--status-orange)/0.06)]";
  return "border-l-[hsl(var(--status-green))] bg-[hsl(var(--status-green)/0.06)]";
}

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
        "flex flex-col min-w-[140px] flex-1 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        "bg-secondary/50 hover:bg-secondary/80",
        isExpanded && "ring-2 ring-primary/50 shadow-[0_0_20px_hsl(var(--glow-primary)/0.15)]"
      )}
      onClick={onToggle}
    >
      {/* Header — uniform green */}
      <div className="px-3 py-2.5 flex items-center justify-between bg-[hsl(var(--stage-header))] text-primary-foreground font-bold text-sm">
        <span className="truncate">{stage}</span>
        <span className="ml-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
          {jobs.length}
        </span>
      </div>

      {/* Mini cards */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 max-h-[280px]">
        {jobs.map((job) => (
          <MiniCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function MiniCard({ job }: { job: Job }) {
  return (
    <div
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-xs space-y-0.5 border-l-[3px] transition-all hover:translate-x-0.5",
        "bg-card shadow-sm hover:shadow-md",
        getStatusColor(job)
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="font-semibold text-card-foreground truncate">{job.client}</span>
        {job.urgent && <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />}
      </div>
      <p className="text-muted-foreground truncate text-[11px]">{job.jobName}</p>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="font-semibold text-card-foreground">${job.value.toLocaleString()}</span>
        <span className="text-[10px] opacity-60">{job.ageDays}d · {job.id}</span>
      </div>
    </div>
  );
}
