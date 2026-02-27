import { ChevronRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/data/dummyJobs";
import { STAGE_LABELS } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";
import { useThresholds } from "@/contexts/ThresholdContext";
import { ThresholdSettings } from "@/components/ThresholdSettings";
import { useNotificationStyle } from "@/contexts/NotificationStyleContext";
import { TutorialTip } from "@/components/TutorialTip";

function countByStatus(jobs: Job[], greenMax: number, orangeMax: number) {
  let red = 0, orange = 0, green = 0;
  for (const j of jobs) {
    if (j.urgent || j.ageDays > orangeMax) red++;
    else if (j.ageDays > greenMax) orange++;
    else green++;
  }
  return { red, orange, green };
}

/** Bright blue notification dot with glow ping */
function UnreadDot() {
  return (
    <span className="relative flex h-3 w-3 shrink-0">
      <span className="animate-glow-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.5)]" />
    </span>
  );
}

/** Job preview row inside a color band */
function JobPreview({ job, notifStyle }: { job: Job; notifStyle: "icon" | "pulse" }) {
  return (
    <div className={cn(
      "mt-1 text-[11px] text-white/80 leading-tight rounded px-1 -mx-1 transition-all",
      job.hasUnread && notifStyle === "pulse" && "animate-card-pulse bg-white/10"
    )}>
      <div className="font-semibold truncate flex items-center gap-1">
        {job.client}
        {job.hasUnread && notifStyle === "icon" && <UnreadDot />}
        {job.hasUnread && <Mail className="w-3 h-3 text-primary animate-wiggle shrink-0" />}
      </div>
      <div className="truncate opacity-75">{job.jobName}</div>
    </div>
  );
}

/** Stage-specific tutorial tips */
const STAGE_TIPS: Record<string, string> = {
  "Lead": "Click to see all your new leads",
  "To Quote": "Click to see jobs waiting for a quote",
  "Quote Sent": "Click to see quotes you've sent out",
  "In Progress": "Click to see jobs you're working on",
  "To Invoice": "Click to see jobs ready to invoice",
  "Paid": "Click to see completed & paid jobs",
};

const COLOR_TIPS = {
  green: "These jobs are on track — click to open the first one",
  orange: "These are getting old — click to jump in and follow up",
  red: "Overdue! Click here to action the most urgent one first",
};

interface StageColumnProps {
  stage: string;
  jobs: Job[];
  isExpanded: boolean;
  onToggle: () => void;
  onNext?: () => void;
  layout?: "horizontal" | "vertical";
}

export function StageColumn({ stage, jobs, isExpanded, onToggle, onNext, layout = "horizontal" }: StageColumnProps) {
  const isVertical = layout === "vertical";
  const navigate = useNavigate();
  const { getThresholds, getLabel } = useThresholds();
  const { style: notifStyle } = useNotificationStyle();
  const thresholds = getThresholds(stage);
  const counts = countByStatus(jobs, thresholds.greenMax, thresholds.orangeMax);
  const firstGreen = jobs.find(j => !j.urgent && j.ageDays <= thresholds.greenMax);
  const firstOrange = jobs.find(j => !j.urgent && j.ageDays > thresholds.greenMax && j.ageDays <= thresholds.orangeMax);
  const firstRed = jobs.find(j => j.urgent || j.ageDays > thresholds.orangeMax);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
        "hover:bg-secondary/80",
        isExpanded && "ring-2 ring-primary/50 shadow-[0_0_20px_hsl(var(--glow-primary)/0.15)]",
        isVertical ? "min-w-[220px] w-full" : "flex-1 min-w-0"
      )}
      style={{ backgroundColor: "hsl(var(--column-bg))" }}
    >
      {/* Header — arrow-shaped pointing right */}
      <TutorialTip tip={STAGE_TIPS[stage] || `Click to expand ${stage}`} side="top">
        <div
          onClick={onToggle}
          className="relative px-3 py-2 flex items-start justify-between text-primary-foreground font-bold text-sm h-[52px] cursor-pointer"
          style={{
            backgroundColor: "hsl(var(--stage-header))",
            backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 8px, hsl(var(--border) / 0.2) 8px, hsl(var(--border) / 0.2) 9px)",
          }}
        >
          <div className="leading-snug min-w-0">
            <div className="truncate">{(STAGE_LABELS[stage as keyof typeof STAGE_LABELS] ?? [stage])[0]}</div>
            <div className="text-xs font-medium opacity-70 truncate h-[16px]">
              {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]?.[1] ?? "\u00A0"}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 mt-0.5 mr-2">
            <span
              className="flex shrink-0 opacity-60 -space-x-2 cursor-pointer hover:opacity-100 transition-opacity"
              onClick={(e) => {
                if (onNext) {
                  e.stopPropagation();
                  onNext();
                }
              }}
            >
              <ChevronRight className="w-5 h-5" />
              <ChevronRight className="w-5 h-5" />
            </span>
            <TutorialTip tip={`${jobs.length} jobs in this stage`} side="bottom">
              <span className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
                {jobs.length}
              </span>
            </TutorialTip>
            <ThresholdSettings stage={stage} />
          </div>
          {/* Right arrow point */}
          <div
            className="absolute right-0 top-0 h-full w-[14px] translate-x-[7px] z-10"
            style={{
              clipPath: "polygon(0 0, 0 100%, 100% 50%)",
              backgroundColor: "hsl(var(--stage-header))",
              backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 8px, hsl(var(--border) / 0.2) 8px, hsl(var(--border) / 0.2) 9px)",
            }}
          />
        </div>
      </TutorialTip>

      {/* Color cards with count + first job details */}
      <div className="p-2 flex flex-col gap-1.5">
        {/* Green */}
        <TutorialTip tip={COLOR_TIPS.green} side="right">
          <div
            className="rounded-md bg-[hsl(var(--status-green))] px-3 py-1.5 h-[72px] shadow-sm border border-white/10 hover:shadow-md transition-shadow cursor-pointer"
            onClick={(e) => { e.stopPropagation(); if (firstGreen) { const isQ = ["Lead","To Quote","Quote Sent"].includes(firstGreen.stage); navigate(isQ ? `/quote/${firstGreen.id}` : `/job/${firstGreen.id}`); } }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90">{getLabel(stage, "green")}</span>
              <span className="text-sm font-bold text-white">{counts.green}</span>
            </div>
            {firstGreen ? (
              <JobPreview job={firstGreen} notifStyle={notifStyle} />
            ) : counts.green === 0 ? (
              <div className="mt-1 text-[11px] text-white/50 italic">No jobs</div>
            ) : null}
          </div>
        </TutorialTip>
        {/* Orange */}
        <TutorialTip tip={COLOR_TIPS.orange} side="right">
          <div
            className="rounded-md bg-[hsl(var(--status-orange))] px-3 py-1.5 h-[72px] shadow-sm border border-white/10 hover:shadow-md transition-shadow cursor-pointer"
            onClick={(e) => { e.stopPropagation(); if (firstOrange) { const isQ = ["Lead","To Quote","Quote Sent"].includes(firstOrange.stage); navigate(isQ ? `/quote/${firstOrange.id}` : `/job/${firstOrange.id}`); } }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90">{getLabel(stage, "orange")}</span>
              <span className="text-sm font-bold text-white">{counts.orange}</span>
            </div>
            {firstOrange ? (
              <JobPreview job={firstOrange} notifStyle={notifStyle} />
            ) : counts.orange === 0 ? (
              <div className="mt-1 text-[11px] text-white/50 italic">No jobs</div>
            ) : null}
          </div>
        </TutorialTip>
        {/* Red */}
        <TutorialTip tip={COLOR_TIPS.red} side="right">
          <div
            className="rounded-md bg-[hsl(var(--status-red))] px-3 py-1.5 h-[72px] shadow-sm border border-white/10 hover:shadow-md transition-shadow cursor-pointer"
            onClick={(e) => { e.stopPropagation(); if (firstRed) { const isQ = ["Lead","To Quote","Quote Sent"].includes(firstRed.stage); navigate(isQ ? `/quote/${firstRed.id}` : `/job/${firstRed.id}`); } }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90">{getLabel(stage, "red")}</span>
              <span className="text-sm font-bold text-white">{counts.red}</span>
            </div>
            {firstRed ? (
              <JobPreview job={firstRed} notifStyle={notifStyle} />
            ) : counts.red === 0 ? (
              <div className="mt-1 text-[11px] text-white/50 italic">No jobs</div>
            ) : null}
          </div>
        </TutorialTip>
      </div>
    </div>
  );
}
