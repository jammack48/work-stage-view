import { useMemo } from "react";
import { addDays, format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduleJob, WORK_START, WORK_END, HOUR_HEIGHT_DESKTOP, formatTime } from "./scheduleData";
import { ScheduleJobCard } from "./ScheduleJobCard";

interface TimeGridDesktopProps {
  weekStart: Date;
  jobs: ScheduleJob[];
  selectedDay?: number;
  onSlotClick?: (dayOffset: number, hour: number) => void;
  activeSlot?: { dayOffset: number; startHour: number } | null;
}

function computeOverlapLayout(jobs: ScheduleJob[]) {
  // Sort by start hour
  const sorted = [...jobs].sort((a, b) => a.startHour - b.startHour);
  const layout: { job: ScheduleJob; col: number; totalCols: number }[] = [];
  const columns: { endHour: number }[] = [];

  for (const job of sorted) {
    let placed = false;
    for (let c = 0; c < columns.length; c++) {
      if (job.startHour >= columns[c].endHour) {
        columns[c].endHour = job.startHour + job.durationHours;
        layout.push({ job, col: c, totalCols: 0 });
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push({ endHour: job.startHour + job.durationHours });
      layout.push({ job, col: columns.length - 1, totalCols: 0 });
    }
  }

  // Set totalCols for all entries
  const totalCols = columns.length;
  for (const l of layout) l.totalCols = totalCols;
  return layout;
}

export function TimeGridDesktop({ weekStart, jobs, selectedDay, onSlotClick, activeSlot }: TimeGridDesktopProps) {
  const hours = Array.from({ length: WORK_END - WORK_START }, (_, i) => WORK_START + i);
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  const totalHeight = hours.length * HOUR_HEIGHT_DESKTOP;

  const dayLayouts = useMemo(() => {
    return days.map((_, di) => {
      const dayJobs = jobs.filter((j) => j.dayOffset === di);
      return computeOverlapLayout(dayJobs);
    });
  }, [jobs, days.length]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Day headers */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-border">
          <div />
          {days.map((d, i) => (
            <div
              key={i}
              className={cn(
                "text-center py-2 text-xs font-semibold border-l border-border",
                isToday(d) && "text-primary"
              )}
            >
              {format(d, "EEE d")}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)]" style={{ height: totalHeight }}>
          {/* Time labels */}
          <div className="relative">
            {hours.map((h, i) => (
              <div
                key={h}
                className="absolute right-2 text-[10px] text-muted-foreground font-medium"
                style={{ top: i * HOUR_HEIGHT_DESKTOP - 6 }}
              >
                {formatTime(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d, di) => (
            <div
              key={di}
              className={cn(
                "relative border-l border-border",
                selectedDay === di && "bg-primary/15",
                selectedDay !== di && isToday(d) && "bg-primary/5"
              )}
            >
              {/* Hour lines — clickable when booking */}
              {hours.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute left-0 right-0 border-t border-border/50",
                    onSlotClick && "cursor-pointer hover:bg-primary/10 transition-colors"
                  )}
                  style={{ top: i * HOUR_HEIGHT_DESKTOP, height: HOUR_HEIGHT_DESKTOP }}
                  onClick={() => onSlotClick?.(di, h)}
                />
              ))}

              {/* Job cards */}
              {dayLayouts[di]?.map(({ job, col, totalCols }) => {
                const top = (job.startHour - WORK_START) * HOUR_HEIGHT_DESKTOP;
                const height = job.durationHours * HOUR_HEIGHT_DESKTOP;
                const widthPct = 100 / totalCols;
                const leftPct = col * widthPct;

                return (
                  <div
                    key={job.id}
                    className="absolute px-0.5"
                    style={{
                      top: top + 1,
                      height: height - 2,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                    }}
                  >
                    <ScheduleJobCard job={job} compact={totalCols > 2} style={{ height: "100%" }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
