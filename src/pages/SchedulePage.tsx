import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { startOfWeek, addDays, format, addWeeks, subWeeks } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Columns, LayoutGrid, Users, FilePlus, FileText, Settings, Package, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageToolbar } from "@/components/PageToolbar";
import useEmblaCarousel from "embla-carousel-react";

const HOME_TABS = [
  { id: "pipeline", label: "Pipeline", icon: Columns },
  { id: "bundles", label: "Bundles", icon: Package },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "customers", label: "Customers", icon: Users },
  { id: "quotes", label: "New Quote", icon: FilePlus },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

type ViewMode = "staff" | "day";

interface ScheduleJob {
  id: string;
  jobName: string;
  client: string;
  assignedTo: string;
  dayOffset: number; // 0=Mon, 1=Tue, ...4=Fri
  startHour: number;
  durationHours: number;
}

const STAFF = ["Dave", "Mike", "Tama", "Lisa", "Hemi"];

const STAFF_COLORS: Record<string, string> = {
  Dave: "hsl(var(--primary))",
  Mike: "hsl(210 70% 50%)",
  Tama: "hsl(150 60% 40%)",
  Lisa: "hsl(330 65% 50%)",
  Hemi: "hsl(30 80% 50%)",
};

const DEMO_JOBS: ScheduleJob[] = [
  { id: "TB-0501", jobName: "Kitchen Plumbing", client: "Dave Thompson", assignedTo: "Dave", dayOffset: 0, startHour: 8, durationHours: 7 },
  { id: "TB-0502", jobName: "Roof Repair", client: "Sarah Mitchell", assignedTo: "Mike", dayOffset: 1, startHour: 9, durationHours: 7 },
  { id: "TB-0503", jobName: "Bathroom Reno", client: "Rangi Patel", assignedTo: "Tama", dayOffset: 0, startHour: 8, durationHours: 9 },
  { id: "TB-0504", jobName: "Bathroom Reno", client: "Rangi Patel", assignedTo: "Tama", dayOffset: 1, startHour: 8, durationHours: 9 },
  { id: "TB-0505", jobName: "Deck Lighting", client: "Jenny Wu", assignedTo: "Dave", dayOffset: 2, startHour: 7, durationHours: 7 },
  { id: "TB-0506", jobName: "Tiling", client: "Lisa Chen", assignedTo: "Lisa", dayOffset: 2, startHour: 10, durationHours: 6 },
  { id: "TB-0507", jobName: "Tiling", client: "Lisa Chen", assignedTo: "Lisa", dayOffset: 3, startHour: 10, durationHours: 6 },
  { id: "TB-0508", jobName: "Fence Repair", client: "Mike O'Brien", assignedTo: "Mike", dayOffset: 3, startHour: 8, durationHours: 8 },
  { id: "TB-0509", jobName: "Exterior Paint", client: "Hemi Brown", assignedTo: "Tama", dayOffset: 4, startHour: 7, durationHours: 8 },
  { id: "TB-0510", jobName: "EV Charger Install", client: "Steve Archer", assignedTo: "Hemi", dayOffset: 1, startHour: 9, durationHours: 5 },
  { id: "TB-0511", jobName: "Heat Pump Install", client: "Karen Ngata", assignedTo: "Hemi", dayOffset: 3, startHour: 8, durationHours: 6 },
];

function formatTime(hour: number) {
  return hour <= 12 ? `${hour}am` : `${hour - 12}pm`;
}

function JobCard({ job, compact }: { job: ScheduleJob; compact?: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/job/${job.id}`)}
      className={cn(
        "text-left rounded-lg border bg-card p-2 hover:shadow-md transition-shadow cursor-pointer w-full",
        compact ? "p-1.5" : "p-2"
      )}
      style={{ borderLeftWidth: 3, borderLeftColor: STAFF_COLORS[job.assignedTo] }}
    >
      <div className={cn("font-medium truncate", compact ? "text-[11px]" : "text-xs")}>{job.jobName}</div>
      <div className={cn("text-muted-foreground truncate", compact ? "text-[10px]" : "text-[11px]")}>{job.client}</div>
      <div className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-[11px]")}>
        {formatTime(job.startHour)}–{formatTime(job.startHour + job.durationHours)}
      </div>
    </button>
  );
}

function StaffRowsView({ weekStart, jobs }: { weekStart: Date; jobs: ScheduleJob[] }) {
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-background p-2 text-left text-xs font-semibold text-muted-foreground w-24 border-b border-border">Staff</th>
            {days.map((d, i) => (
              <th key={i} className="p-2 text-center text-xs font-semibold text-muted-foreground border-b border-border min-w-[120px]">
                {format(d, "EEE d")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STAFF.map((staff) => (
            <tr key={staff} className="border-b border-border/50">
              <td
                className="sticky left-0 z-10 bg-background p-2 text-sm font-medium whitespace-nowrap"
                style={{ color: STAFF_COLORS[staff] }}
              >
                {staff}
              </td>
              {days.map((_, di) => {
                const cellJobs = jobs.filter((j) => j.assignedTo === staff && j.dayOffset === di);
                return (
                  <td key={di} className="p-1 align-top">
                    <div className="flex flex-col gap-1">
                      {cellJobs.map((j) => (
                        <JobCard key={j.id} job={j} compact />
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DayColumnsDesktop({ weekStart, jobs }: { weekStart: Date; jobs: ScheduleJob[] }) {
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-5 gap-3">
      {days.map((d, di) => {
        const dayJobs = jobs.filter((j) => j.dayOffset === di);
        return (
          <div key={di} className="flex flex-col gap-2">
            <div className="text-center text-sm font-semibold text-muted-foreground py-1 border-b border-border">
              {format(d, "EEE d")}
            </div>
            <div className="flex flex-col gap-2">
              {dayJobs.length === 0 && (
                <div className="text-center text-xs text-muted-foreground/50 py-4">No jobs</div>
              )}
              {dayJobs.map((j) => (
                <div key={j.id} className="rounded-lg border bg-card p-2.5 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ borderLeftWidth: 3, borderLeftColor: STAFF_COLORS[j.assignedTo] }}
                  onClick={() => window.location.href = `/job/${j.id}`}
                >
                  <div className="text-xs font-semibold" style={{ color: STAFF_COLORS[j.assignedTo] }}>{j.assignedTo}</div>
                  <div className="text-sm font-medium truncate">{j.jobName}</div>
                  <div className="text-xs text-muted-foreground truncate">{j.client}</div>
                  <div className="text-xs text-muted-foreground">{formatTime(j.startHour)}–{formatTime(j.startHour + j.durationHours)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayColumnsMobile({ weekStart, jobs }: { weekStart: Date; jobs: ScheduleJob[] }) {
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center" });
  const [currentSlide, setCurrentSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => emblaApi?.scrollPrev()} disabled={currentSlide === 0}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex gap-1.5">
          {days.map((_, i) => (
            <span key={i} className={cn("w-2 h-2 rounded-full transition-all", i === currentSlide ? "bg-primary scale-125" : "bg-muted-foreground/30")} />
          ))}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => emblaApi?.scrollNext()} disabled={currentSlide === 4}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {days.map((d, di) => {
            const dayJobs = jobs.filter((j) => j.dayOffset === di);
            return (
              <div key={di} className="flex-[0_0_85%] max-w-[320px] min-w-0 px-2">
                <div className="text-center text-sm font-semibold text-muted-foreground py-2 border-b border-border mb-2">
                  {format(d, "EEEE d")}
                </div>
                <div className="flex flex-col gap-2">
                  {dayJobs.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground/50 py-6">No jobs</div>
                  )}
                  {dayJobs.map((j) => (
                    <div key={j.id} className="rounded-lg border bg-card p-3 cursor-pointer hover:shadow-md transition-shadow"
                      style={{ borderLeftWidth: 3, borderLeftColor: STAFF_COLORS[j.assignedTo] }}
                      onClick={() => window.location.href = `/job/${j.id}`}
                    >
                      <div className="text-xs font-semibold" style={{ color: STAFF_COLORS[j.assignedTo] }}>{j.assignedTo}</div>
                      <div className="text-sm font-medium">{j.jobName}</div>
                      <div className="text-xs text-muted-foreground">{j.client}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(j.startHour)}–{formatTime(j.startHour + j.durationHours)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SchedulePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [viewMode, setViewMode] = useState<ViewMode>("staff");

  const weekEnd = addDays(weekStart, 4);

  const handleTabChange = (id: string) => {
    if (id === "pipeline") { navigate("/pipeline"); return; }
    if (id === "bundles") { navigate("/bundles"); return; }
    if (id === "customers") { navigate("/customers"); return; }
    if (id === "settings") { navigate("/settings"); return; }
    if (id === "quotes") { navigate("/quote/new"); return; }
    if (id === "invoices") { navigate("/job/new?stage=To+Invoice"); return; }
  };

  return (
    <PageToolbar
      tabs={HOME_TABS}
      activeTab="schedule"
      onTabChange={handleTabChange}
      pageHeading={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-card-foreground font-bold text-base">Weekly Schedule</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground font-medium min-w-[120px] text-center">
                {format(weekStart, "d MMM")} – {format(weekEnd, "d MMM")}
              </span>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("staff")}
              className={cn(
                "h-7 px-2.5 gap-1.5 text-xs",
                viewMode === "staff" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Rows3 className="w-3.5 h-3.5" />
              Staff
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("day")}
              className={cn(
                "h-7 px-2.5 gap-1.5 text-xs",
                viewMode === "day" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Days
            </Button>
          </div>
        </div>
      }
    >
      {viewMode === "staff" ? (
        <StaffRowsView weekStart={weekStart} jobs={DEMO_JOBS} />
      ) : isMobile ? (
        <DayColumnsMobile weekStart={weekStart} jobs={DEMO_JOBS} />
      ) : (
        <DayColumnsDesktop weekStart={weekStart} jobs={DEMO_JOBS} />
      )}
    </PageToolbar>
  );
};

export default SchedulePage;
