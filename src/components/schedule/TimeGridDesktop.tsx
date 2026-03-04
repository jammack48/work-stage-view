import { useMemo, useRef, useCallback } from "react";
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
  activeDuration?: number;
  /** Show fewer day columns (e.g. 3 on mobile week view). Defaults to 7. */
  visibleDays?: number;
  /** Which dayOffset to start from when visibleDays < 7. Defaults to 0. */
  startDayOffset?: number;
  /** Called when user swipes left/right to shift the visible window */
  onWindowShift?: (direction: "left" | "right") => void;
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

export function TimeGridDesktop({ weekStart, jobs, selectedDay, onSlotClick, activeSlot, activeDuration = 2, visibleDays = 7, startDayOffset = 0, onWindowShift }: TimeGridDesktopProps) {
  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || !onWindowShift) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) {
      onWindowShift(dx < 0 ? "right" : "left");
    }
  }, [onWindowShift]);
  const hours = Array.from({ length: WORK_END - WORK_START }, (_, i) => WORK_START + i);
  const allDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  // Slice to visible window
  const days = allDays.slice(startDayOffset, startDayOffset + visibleDays);
  const dayIndices = days.map((_, i) => startDayOffset + i);
  const totalHeight = hours.length * HOUR_HEIGHT_DESKTOP;

  const dayLayouts = useMemo(() => {
    return dayIndices.map((di) => {
      const dayJobs = jobs.filter((j) => j.dayOffset === di);
      return computeOverlapLayout(dayJobs);
    });
  }, [jobs, dayIndices.join(",")]);

  return (
    <div className="overflow-hidden touch-pan-y" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div>
        {/* Day headers */}
        <div className={`grid border-b border-border`} style={{ gridTemplateColumns: `60px repeat(${visibleDays}, 1fr)` }}>
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
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${visibleDays}, 1fr)`, height: totalHeight }}>
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
          {days.map((d, i) => {
            const di = dayIndices[i];
            return (
            <div
              key={di}
              className={cn(
                "relative border-l border-border",
                selectedDay === di && "bg-primary/15",
                selectedDay !== di && isToday(d) && "bg-primary/5"
              )}
            >
              {/* Hour lines */}
              {hours.map((h, hi) => (
                <div
                  key={hi}
                  className="absolute left-0 right-0 border-t border-border/50"
                  style={{ top: hi * HOUR_HEIGHT_DESKTOP, height: HOUR_HEIGHT_DESKTOP }}
                />
              ))}

              {/* Job cards */}
              {dayLayouts[i]?.map(({ job, col, totalCols }) => {
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
                    <ScheduleJobCard job={job} compact={totalCols > 2 || visibleDays <= 3} style={{ height: "100%", pointerEvents: onSlotClick ? "none" : undefined }} />
                  </div>
                );
              })}

              {/* Booking overlay */}
              {onSlotClick && (
                <div className="absolute inset-0 z-50">
                  {hours.map((h, hi) => {
                    const isActive = activeSlot?.dayOffset === di && activeSlot?.startHour === h;
                    return (
                      <div
                        key={`overlay-${hi}`}
                        className={cn(
                          "absolute left-0 right-0 cursor-pointer transition-colors border-t border-transparent hover:bg-primary/15",
                          isActive && "bg-primary/25 border-primary/40"
                        )}
                        style={{ top: hi * HOUR_HEIGHT_DESKTOP, height: HOUR_HEIGHT_DESKTOP }}
                        onClick={() => onSlotClick(di, h)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
