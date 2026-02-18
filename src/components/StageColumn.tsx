import type { Job } from "@/data/dummyJobs";
import { STAGE_LABELS } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";
import { useThresholds } from "@/contexts/ThresholdContext";
import { ThresholdSettings } from "@/components/ThresholdSettings";

function countByStatus(jobs: Job[], greenMax: number, orangeMax: number) {
  let red = 0, orange = 0, green = 0;
  for (const j of jobs) {
    if (j.urgent || j.ageDays > orangeMax) red++;
    else if (j.ageDays > greenMax) orange++;
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
  const { getThresholds, getLabel } = useThresholds();
  const thresholds = getThresholds(stage);
  const counts = countByStatus(jobs, thresholds.greenMax, thresholds.orangeMax);
  const firstGreen = jobs.find(j => !j.urgent && j.ageDays <= thresholds.greenMax);
  const firstOrange = jobs.find(j => !j.urgent && j.ageDays > thresholds.greenMax && j.ageDays <= thresholds.orangeMax);
  const firstRed = jobs.find(j => j.urgent || j.ageDays > thresholds.orangeMax);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        "bg-secondary/50 hover:bg-secondary/80",
        isExpanded && "ring-2 ring-primary/50 shadow-[0_0_20px_hsl(var(--glow-primary)/0.15)]",
        isVertical ? "min-w-[220px] w-full" : "flex-1 min-w-0"
      )}
      onClick={onToggle}
    >
      {/* Header — fixed height, always 2 lines worth */}
      <div className="px-3 py-2 flex items-start justify-between bg-[hsl(var(--stage-header))] text-primary-foreground font-bold text-sm h-[52px]">
        <div className="leading-snug min-w-0">
          <div className="truncate">{(STAGE_LABELS[stage as keyof typeof STAGE_LABELS] ?? [stage])[0]}</div>
          <div className="text-xs font-medium opacity-70 truncate h-[16px]">
            {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]?.[1] ?? "\u00A0"}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <span className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
            {jobs.length}
          </span>
          <ThresholdSettings stage={stage} />
        </div>
      </div>

      {/* Color cards with count + first job details */}
      <div className="p-2 flex flex-col gap-1.5">
        {/* Green */}
        <div className="rounded-md bg-[hsl(var(--status-green))] px-3 py-1.5 h-[72px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90">{getLabel(stage, "green")}</span>
            <span className="text-sm font-bold text-white">{counts.green}</span>
          </div>
          {firstGreen ? (
            <div className="mt-1 text-[11px] text-white/80 leading-tight">
              <div className="font-semibold truncate">{firstGreen.client}</div>
              <div className="truncate opacity-75">{firstGreen.jobName}</div>
            </div>
          ) : counts.green === 0 ? (
            <div className="mt-1 text-[11px] text-white/50 italic">No jobs</div>
          ) : null}
        </div>
        {/* Orange */}
        <div className="rounded-md bg-[hsl(var(--status-orange))] px-3 py-1.5 h-[72px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90">{getLabel(stage, "orange")}</span>
            <span className="text-sm font-bold text-white">{counts.orange}</span>
          </div>
          {firstOrange ? (
            <div className="mt-1 text-[11px] text-white/80 leading-tight">
              <div className="font-semibold truncate">{firstOrange.client}</div>
              <div className="truncate opacity-75">{firstOrange.jobName}</div>
            </div>
          ) : counts.orange === 0 ? (
            <div className="mt-1 text-[11px] text-white/50 italic">No jobs</div>
          ) : null}
        </div>
        {/* Red */}
        <div className="rounded-md bg-[hsl(var(--status-red))] px-3 py-1.5 h-[72px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90">{getLabel(stage, "red")}</span>
            <span className="text-sm font-bold text-white">{counts.red}</span>
          </div>
          {firstRed ? (
            <div className="mt-1 text-[11px] text-white/80 leading-tight">
              <div className="font-semibold truncate">{firstRed.client}</div>
              <div className="truncate opacity-75">{firstRed.jobName}</div>
            </div>
          ) : counts.red === 0 ? (
            <div className="mt-1 text-[11px] text-white/50 italic">No jobs</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
