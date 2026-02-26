import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScheduleJob, STAFF_COLORS, formatTime } from "./scheduleData";

interface ScheduleJobCardProps {
  job: ScheduleJob;
  style?: React.CSSProperties;
  compact?: boolean;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  "In Progress": "default",
  Scheduled: "secondary",
  Invoiced: "outline",
};

export function ScheduleJobCard({ job, style, compact }: ScheduleJobCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/job/${job.id}`)}
      className={cn(
        "text-left rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer w-full overflow-hidden",
        compact ? "p-1.5" : "p-2"
      )}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: STAFF_COLORS[job.assignedTo],
        ...style,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className={cn("font-semibold truncate", compact ? "text-[10px]" : "text-xs")}>
            {job.jobName}
          </div>
          <div className={cn("text-muted-foreground truncate", compact ? "text-[9px]" : "text-[11px]")}>
            {job.client}
          </div>
        </div>
        {!compact && (
          <Badge variant={STATUS_VARIANT[job.status] || "secondary"} className="text-[9px] px-1.5 py-0 shrink-0 h-4">
            {job.status}
          </Badge>
        )}
      </div>
      {!compact && (
        <div className="text-[10px] text-muted-foreground truncate mt-0.5">{job.address}</div>
      )}
      <div className={cn("text-muted-foreground font-medium", compact ? "text-[9px]" : "text-[10px]")}>
        <span style={{ color: STAFF_COLORS[job.assignedTo] }}>{job.assignedTo}</span>
        {" · "}
        {formatTime(job.startHour)}–{formatTime(job.startHour + job.durationHours)}
      </div>
    </button>
  );
}
