import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";

function countByStatus(jobs: Job[]) {
  let red = 0, orange = 0, green = 0;
  for (const j of jobs) {
    if (j.urgent) red++;
    else if (j.ageDays > 14) orange++;
    else green++;
  }
  return { red, orange, green };
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
  const counts = countByStatus(jobs);
  const firstGreen = jobs.find(j => !j.urgent && j.ageDays <= 14);
  const firstOther = jobs.find(j => j.urgent || j.ageDays > 14);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        "bg-secondary/50 hover:bg-secondary/80",
        isExpanded && "ring-2 ring-primary/50 shadow-[0_0_20px_hsl(var(--glow-primary)/0.15)]",
        isVertical ? "min-w-[220px] w-full" : "min-w-[160px] flex-1"
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

      {/* 3 color cards with counts */}
      <div className="p-2 flex flex-col gap-1.5">
        <div className="rounded-md bg-[hsl(var(--status-green))] px-3 py-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90">Green</span>
          <span className="text-sm font-bold text-white">{counts.green}</span>
        </div>
        <div className="rounded-md bg-[hsl(var(--status-orange))] px-3 py-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90">Orange</span>
          <span className="text-sm font-bold text-white">{counts.orange}</span>
        </div>
        <div className="rounded-md bg-[hsl(var(--status-red))] px-3 py-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90">Red</span>
          <span className="text-sm font-bold text-white">{counts.red}</span>
        </div>
      </div>

      {/* Preview: first green & first non-green job */}
      <div className="px-2 pb-2 flex flex-col gap-1">
        {firstGreen && (
          <div className="rounded-md bg-card px-2.5 py-1.5 border-l-3 border-l-[hsl(var(--status-green))] text-xs">
            <div className="font-semibold text-card-foreground truncate">{firstGreen.client}</div>
            <div className="text-muted-foreground truncate">{firstGreen.jobName}</div>
          </div>
        )}
        {firstOther && (
          <div className={cn(
            "rounded-md bg-card px-2.5 py-1.5 border-l-3 text-xs",
            firstOther.urgent ? "border-l-[hsl(var(--status-red))]" : "border-l-[hsl(var(--status-orange))]"
          )}>
            <div className="font-semibold text-card-foreground truncate">{firstOther.client}</div>
            <div className="text-muted-foreground truncate">{firstOther.jobName}</div>
          </div>
        )}
      </div>
    </div>
  );
}
