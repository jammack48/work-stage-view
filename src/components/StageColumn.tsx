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

      {/* 3 stacked color indicator cards */}
      <div className="p-3 flex justify-center">
        <div className="relative w-24 h-16">
          {/* Green card (back) */}
          <div className={cn(
            "absolute inset-x-0 top-0 h-10 rounded-md bg-[hsl(var(--status-green))] shadow-sm",
            "flex items-center justify-center text-xs font-bold text-white/90",
            counts.green === 0 && "opacity-30"
          )}>
            {counts.green}
          </div>
          {/* Orange card (middle) */}
          <div className={cn(
            "absolute inset-x-1 top-3 h-10 rounded-md bg-[hsl(var(--status-orange))] shadow-md",
            "flex items-center justify-center text-xs font-bold text-white/90",
            counts.orange === 0 && "opacity-30"
          )}>
            {counts.orange}
          </div>
          {/* Red card (front) */}
          <div className={cn(
            "absolute inset-x-2 top-6 h-10 rounded-md bg-[hsl(var(--status-red))] shadow-lg",
            "flex items-center justify-center text-xs font-bold text-white/90",
            counts.red === 0 && "opacity-30"
          )}>
            {counts.red}
          </div>
        </div>
      </div>
    </div>
  );
}
