import { useMemo, useRef, useCallback } from "react";
import { format, isToday, startOfWeek, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduleJob, WORK_START, WORK_END, HOUR_HEIGHT_DESKTOP, formatTime, generateWeekJobs } from "./scheduleData";
import { ScheduleJobCard } from "./ScheduleJobCard";

interface TimeGrid3DayProps {
  /** The dates to display (commonly 3 or 5 days) */
  dates: Date[];
  /** Staff filter (e.g. "Dave") */
  staffFilter?: string;
  selectedDate?: Date;
  onSwipe?: (direction: "left" | "right") => void;
}

function computeOverlapLayout(jobs: ScheduleJob[]) {
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

  const totalCols = columns.length;
  for (const l of layout) l.totalCols = totalCols;
  return layout;
}

export function TimeGrid3Day({ dates, staffFilter, selectedDate, onSwipe }: TimeGrid3DayProps) {
  const hours = Array.from({ length: WORK_END - WORK_START }, (_, i) => WORK_START + i);
  const totalHeight = hours.length * HOUR_HEIGHT_DESKTOP;

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || !onSwipe) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) {
      onSwipe(dx < 0 ? "right" : "left");
    }
  }, [onSwipe]);

  // Get jobs for each date, handling cross-week boundaries
  const dayLayouts = useMemo(() => {
    // Cache weeks we've generated
    const weekCache = new Map<string, ScheduleJob[]>();
    const getWeekJobs = (date: Date) => {
      const ws = startOfWeek(date, { weekStartsOn: 1 });
      const key = ws.toISOString();
      if (!weekCache.has(key)) {
        let jobs = generateWeekJobs(ws);
        if (staffFilter) jobs = jobs.filter(j => j.assignedTo === staffFilter);
        weekCache.set(key, jobs);
      }
      return { weekStart: startOfWeek(date, { weekStartsOn: 1 }), jobs: weekCache.get(key)! };
    };

    return dates.map(date => {
      const { weekStart, jobs } = getWeekJobs(date);
      const dayOffset = differenceInCalendarDays(date, weekStart);
      const dayJobs = jobs.filter(j => j.dayOffset === dayOffset);
      return computeOverlapLayout(dayJobs);
    });
  }, [dates, staffFilter]);

  return (
    <div className="overflow-hidden touch-pan-y" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Day headers */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: `40px repeat(${dates.length}, minmax(0, 1fr))` }}>
        <div />
        {dates.map((d, i) => (
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
      <div className="grid" style={{ height: totalHeight, gridTemplateColumns: `40px repeat(${dates.length}, minmax(0, 1fr))` }}>
        {/* Time labels */}
        <div className="relative">
          {hours.map((h, i) => (
            <div
              key={h}
              className="absolute right-1 text-[10px] text-muted-foreground font-medium"
              style={{ top: i * HOUR_HEIGHT_DESKTOP - 6 }}
            >
              {formatTime(h)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {dates.map((d, i) => {
          const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
          return (
            <div
              key={i}
              className={cn(
                "relative border-l border-border",
                isSelected && "bg-primary/15",
                !isSelected && isToday(d) && "bg-primary/5"
              )}
            >
              {hours.map((_, hi) => (
                <div
                  key={hi}
                  className="absolute left-0 right-0 border-t border-border/50"
                  style={{ top: hi * HOUR_HEIGHT_DESKTOP, height: HOUR_HEIGHT_DESKTOP }}
                />
              ))}

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
                    <ScheduleJobCard job={job} compact style={{ height: "100%" }} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
