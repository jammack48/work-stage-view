import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";

function getStatusBg(job: Job): string {
  if (job.urgent) return "bg-[hsl(var(--status-red))]";
  if (job.ageDays > 14) return "bg-[hsl(var(--status-orange))]";
  return "bg-[hsl(var(--status-green))]";
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
        "flex flex-col min-w-[130px] flex-1 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
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

      {/* Stacked overlapping cards — no details, just colored blocks */}
      <div className="flex-1 p-3 flex flex-col items-stretch">
        <div className="relative" style={{ height: `${Math.min(jobs.length * 18 + 30, 220)}px` }}>
          {jobs.map((job, i) => (
            <div
              key={job.id}
              className={cn(
                "absolute left-0 right-0 h-[28px] rounded-md shadow-sm border border-white/10 transition-transform hover:scale-[1.03]",
                getStatusBg(job),
                "opacity-90"
              )}
              style={{
                top: `${i * 18}px`,
                zIndex: jobs.length - i,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
