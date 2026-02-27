import { AlertTriangle, X, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/data/dummyJobs";
import { cn } from "@/lib/utils";
import { useThresholds } from "@/contexts/ThresholdContext";
import { useNotificationStyle } from "@/contexts/NotificationStyleContext";

interface ExpandedStagePanelProps {
  stage: string;
  jobs: Job[];
  onClose: () => void;
}

function getStatusDot(job: Job, greenMax: number, orangeMax: number): string {
  if (job.urgent || job.ageDays > orangeMax) return "bg-[hsl(var(--status-red))]";
  if (job.ageDays > greenMax) return "bg-[hsl(var(--status-orange))]";
  return "bg-[hsl(var(--status-green))]";
}

function statusPriority(job: Job, greenMax: number, orangeMax: number): number {
  if (job.urgent || job.ageDays > orangeMax) return 2;
  if (job.ageDays > greenMax) return 1;
  return 0;
}

function sortByStatus(jobs: Job[], greenMax: number, orangeMax: number): Job[] {
  return [...jobs].sort((a, b) => statusPriority(a, greenMax, orangeMax) - statusPriority(b, greenMax, orangeMax));
}

export function ExpandedStagePanel({ stage, jobs, onClose }: ExpandedStagePanelProps) {
  const navigate = useNavigate();
  const { getThresholds } = useThresholds();
  const { style: notifStyle } = useNotificationStyle();
  const thresholds = getThresholds(stage);
  const sorted = sortByStatus(jobs, thresholds.greenMax, thresholds.orangeMax);
  const isQuoteStage = ["Lead", "To Quote", "Quote Sent"].includes(stage);

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
      <div className={cn(
        "grid gap-2 sm:gap-4 px-4 sm:px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50",
        isQuoteStage
          ? "grid-cols-[auto_1fr_60px] sm:grid-cols-[auto_1fr_1fr_80px_70px]"
          : "grid-cols-[auto_1fr_80px_60px] sm:grid-cols-[auto_1fr_1fr_100px_80px_70px]"
      )}>
        <span className="w-3" />
        <span>Client</span>
        <span className="hidden sm:inline">Job</span>
        {!isQuoteStage && <span className="text-right">Value</span>}
        <span className="text-right">Age</span>
        <span className="hidden sm:inline text-right">ID</span>
      </div>

      {/* Job rows sorted green → orange → red */}
      <div className="divide-y divide-border/30">
        {sorted.map((job) => (
          <div
            key={job.id}
            className={cn(
              "grid gap-2 sm:gap-4 px-4 sm:px-5 py-3 items-center hover:bg-accent/30 transition-colors text-sm cursor-pointer",
              isQuoteStage
                ? "grid-cols-[auto_1fr_60px] sm:grid-cols-[auto_1fr_1fr_80px_70px]"
                : "grid-cols-[auto_1fr_80px_60px] sm:grid-cols-[auto_1fr_1fr_100px_80px_70px]"
            )}
            onClick={() => navigate(isQuoteStage ? `/quote/${job.id}` : `/job/${job.id}`)}
          >
            <span className={cn("w-3 h-3 rounded-full shrink-0", getStatusDot(job, thresholds.greenMax, thresholds.orangeMax))} />
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-card-foreground truncate">{job.client}</span>
              {job.urgent && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
              {job.hasUnread && (
                <>
                  {notifStyle === "icon" && (
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-glow-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.5)]" />
                    </span>
                  )}
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0 animate-wiggle" />
                </>
              )}
            </div>
            <span className="hidden sm:inline text-muted-foreground truncate">{job.jobName}</span>
            {!isQuoteStage && (
              <span className="text-right font-semibold text-card-foreground">
                ${job.value.toLocaleString()}
              </span>
            )}
            <span className="text-right text-muted-foreground whitespace-nowrap">{job.ageDays}d ago</span>
            <span className="hidden sm:inline text-right font-mono text-muted-foreground text-xs">{job.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
