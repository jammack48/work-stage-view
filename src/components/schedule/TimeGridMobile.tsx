import { useEffect, useMemo, useRef, useState } from "react";
import { ScheduleJob, WORK_START, WORK_END, HOUR_HEIGHT_MOBILE, formatTime } from "./scheduleData";
import { ScheduleJobCard } from "./ScheduleJobCard";
import { cn } from "@/lib/utils";
import { fetchVariationCounts } from "@/services/variationsService";

interface TimeGridMobileProps {
  jobs: ScheduleJob[];
  dayOffset: number;
  onDayChange?: (day: number) => void;
  onNextWeek?: () => void;
  onPrevWeek?: () => void;
  onSlotClick?: (dayOffset: number, hour: number) => void;
  activeSlot?: { dayOffset: number; startHour: number } | null;
  activeDuration?: number;
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

export function TimeGridMobile({ jobs, dayOffset, onDayChange, onNextWeek, onPrevWeek, onSlotClick, activeSlot, activeDuration = 2 }: TimeGridMobileProps) {
  const [variationCounts, setVariationCounts] = useState<Record<string, number>>({});
  const isBookingMode = !!onSlotClick;
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalSwipe = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isBookingMode) return; // disable swipe in booking mode
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isBookingMode) return;
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 10 && dx > dy) {
      isHorizontalSwipe.current = true;
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isBookingMode) return;
    if (touchStartX.current === null || !onDayChange) {
      touchStartX.current = null;
      return;
    }
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    touchStartY.current = null;
    if (!isHorizontalSwipe.current || Math.abs(diff) < 50) return;
    if (diff > 0) {
      // Swipe left → next day, wrap to next week infinitely
      if (dayOffset < 6) {
        onDayChange(dayOffset + 1);
      } else {
        onNextWeek?.();
        onDayChange(0);
      }
    } else {
      // Swipe right → prev day, wrap to prev week infinitely
      if (dayOffset > 0) {
        onDayChange(dayOffset - 1);
      } else {
        onPrevWeek?.();
        onDayChange(6);
      }
    }
  };
  const hours = Array.from({ length: WORK_END - WORK_START }, (_, i) => WORK_START + i);
  const totalHeight = hours.length * HOUR_HEIGHT_MOBILE;

  const dayJobs = useMemo(() => jobs.filter((j) => j.dayOffset === dayOffset), [jobs, dayOffset]);
  const layout = useMemo(() => computeOverlapLayout(dayJobs), [dayJobs]);

  useEffect(() => {
    let mounted = true;
    fetchVariationCounts(jobs.map((job) => job.id))
      .then((counts) => {
        if (mounted) setVariationCounts(counts);
      })
      .catch(() => {
        if (mounted) setVariationCounts({});
      });

    return () => {
      mounted = false;
    };
  }, [jobs]);

  return (
    <div className="grid grid-cols-[40px_1fr] touch-pan-y" style={{ height: totalHeight, overscrollBehaviorX: "none" }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Time labels */}
      <div className="relative">
        {hours.map((h, i) => (
          <div
            key={h}
            className="absolute right-1 text-[9px] text-muted-foreground font-medium"
            style={{ top: i * HOUR_HEIGHT_MOBILE - 5 }}
          >
            {formatTime(h)}
          </div>
        ))}
      </div>

      {/* Single day column */}
      <div className="relative border-l border-border">
        {/* Hour lines */}
        {hours.map((h, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-border/50"
            style={{ top: i * HOUR_HEIGHT_MOBILE, height: HOUR_HEIGHT_MOBILE }}
          />
        ))}

        {/* Job cards — pointer-events disabled in booking mode */}
        {layout.map(({ job, col, totalCols }) => {
          const top = (job.startHour - WORK_START) * HOUR_HEIGHT_MOBILE;
          const height = job.durationHours * HOUR_HEIGHT_MOBILE;
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
              <ScheduleJobCard
                job={job}
                variationCount={variationCounts[job.id] ?? 0}
                style={{ height: "100%", pointerEvents: isBookingMode ? "none" : undefined }}
              />
            </div>
          );
        })}

        {/* Booking overlay — above job cards */}
        {onSlotClick && (
          <div className="absolute inset-0 z-50">
            {hours.map((h, i) => {
              const isActive = activeSlot?.dayOffset === dayOffset && activeSlot?.startHour === h;
              return (
                <div
                  key={`overlay-${i}`}
                  className={cn(
                    "absolute left-0 right-0 cursor-pointer transition-colors border-t border-transparent hover:bg-primary/15",
                    isActive && "bg-primary/25 border-primary/40"
                  )}
                  style={{ top: i * HOUR_HEIGHT_MOBILE, height: HOUR_HEIGHT_MOBILE }}
                  onClick={(e) => { e.stopPropagation(); onSlotClick(dayOffset, h); }}
                  onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onSlotClick(dayOffset, h); }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
