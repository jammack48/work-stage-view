import { useMemo } from "react";
import { ScheduleJob, WORK_START, WORK_END, HOUR_HEIGHT_MOBILE, formatTime } from "./scheduleData";
import { ScheduleJobCard } from "./ScheduleJobCard";

interface TimeGridMobileProps {
  jobs: ScheduleJob[];
  dayOffset: number;
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

export function TimeGridMobile({ jobs, dayOffset }: TimeGridMobileProps) {
  const hours = Array.from({ length: WORK_END - WORK_START }, (_, i) => WORK_START + i);
  const totalHeight = hours.length * HOUR_HEIGHT_MOBILE;

  const dayJobs = useMemo(() => jobs.filter((j) => j.dayOffset === dayOffset), [jobs, dayOffset]);
  const layout = useMemo(() => computeOverlapLayout(dayJobs), [dayJobs]);

  return (
    <div className="grid grid-cols-[40px_1fr]" style={{ height: totalHeight }}>
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
        {hours.map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-border/50"
            style={{ top: i * HOUR_HEIGHT_MOBILE }}
          />
        ))}

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
              <ScheduleJobCard job={job} style={{ height: "100%" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
