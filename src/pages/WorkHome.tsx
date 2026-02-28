import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, ChevronRight, ChevronDown, ChevronUp, Package, Rows3, Columns3, CalendarDays, LayoutList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DEMO_JOBS, formatTime, STAFF_COLORS } from "@/components/schedule/scheduleData";
import { getJobDetail } from "@/data/dummyJobDetails";
import { cn } from "@/lib/utils";
import { startOfWeek, addDays, format, isToday, isSameDay } from "date-fns";

const CURRENT_STAFF = "Dave";

const STATUS_STYLES: Record<string, { bg: string; dot: string }> = {
  "Scheduled": { bg: "bg-primary/8 border-primary/20", dot: "bg-primary" },
  "In Progress": { bg: "bg-[hsl(var(--status-orange)/0.08)] border-[hsl(var(--status-orange)/0.2)]", dot: "bg-[hsl(var(--status-orange))]" },
  "Invoiced": { bg: "bg-green-500/8 border-green-500/20", dot: "bg-green-500" },
};

type ViewMode = "day" | "week";
type LayoutMode = "vertical" | "horizontal";

export default function WorkHome() {
  const navigate = useNavigate();
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("vertical");

  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today, { weekStartsOn: 1 }));
  const todayOffset = Math.max(0, Math.min(4, Math.floor((today.getTime() - weekStart.getTime()) / 86400000)));
  const [selectedDay, setSelectedDay] = useState(todayOffset > 4 ? 0 : todayOffset);

  const selectedDate = addDays(weekStart, selectedDay);
  const staffColor = STAFF_COLORS[CURRENT_STAFF] || "hsl(var(--primary))";

  // My jobs only
  const myJobs = useMemo(() =>
    DEMO_JOBS.filter((j) => j.assignedTo === CURRENT_STAFF).sort((a, b) => a.dayOffset - b.dayOffset || a.startHour - b.startHour),
    []
  );

  const dayJobs = useMemo(() =>
    myJobs.filter((j) => j.dayOffset === selectedDay),
    [myJobs, selectedDay]
  );

  // Week view: group by day
  const weekDays = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      date: addDays(weekStart, i),
      offset: i,
      jobs: myJobs.filter((j) => j.dayOffset === i),
    })),
    [weekStart, myJobs]
  );

  // Materials for selected day
  const materialsNeeded = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; unit: string }>();
    dayJobs.forEach((sj) => {
      const detail = getJobDetail(sj.id);
      detail?.materials.forEach((m) => {
        const ex = map.get(m.name);
        if (ex) ex.qty += m.quantity;
        else map.set(m.name, { name: m.name, qty: m.quantity, unit: m.unit });
      });
    });
    return Array.from(map.values());
  }, [dayJobs]);

  // Compact day selector
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  function JobCard({ job, compact = false }: { job: typeof DEMO_JOBS[0]; compact?: boolean }) {
    const styles = STATUS_STYLES[job.status] || STATUS_STYLES["Scheduled"];
    return (
      <button
        onClick={() => navigate(`/job/${job.id}`)}
        className="w-full text-left group"
      >
        <div className={cn(
          "rounded-xl border p-3 transition-all",
          styles.bg,
          "hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
          compact && "p-2"
        )}>
          <div className="flex items-start gap-3">
            {/* Time block */}
            <div className="flex flex-col items-center min-w-[52px] shrink-0">
              <span className="text-xs font-bold text-foreground">{formatTime(job.startHour)}</span>
              <div className="w-px h-3 bg-border my-0.5" />
              <span className="text-[10px] text-muted-foreground">{formatTime(job.startHour + job.durationHours)}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full shrink-0", styles.dot)} />
                <p className={cn("font-bold text-card-foreground truncate", compact ? "text-xs" : "text-sm")}>{job.jobName}</p>
              </div>
              <p className="text-xs text-muted-foreground truncate">{job.client}</p>
              {!compact && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{job.address}</span>
                </div>
              )}
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-4 max-w-3xl mx-auto space-y-4 pb-24">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">G'day, {CURRENT_STAFF} 👋</h2>
          <p className="text-sm text-muted-foreground">
            {viewMode === "day"
              ? `${format(selectedDate, "EEEE, d MMMM")}${isToday(selectedDate) ? " — Today" : ""}`
              : `Week of ${format(weekStart, "d MMM")}`
            }
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={layoutMode === "vertical" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setLayoutMode("vertical")}
            title="Vertical layout"
          >
            <Rows3 className="w-4 h-4" />
          </Button>
          <Button
            variant={layoutMode === "horizontal" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setLayoutMode("horizontal")}
            title="Horizontal layout"
          >
            <Columns3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* View toggle: Day / Week */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setViewMode("day")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            viewMode === "day" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
        >
          <LayoutList className="w-4 h-4" /> Day
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            viewMode === "week" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
        >
          <CalendarDays className="w-4 h-4" /> Week
        </button>
      </div>

      {viewMode === "day" ? (
        <div className="space-y-3">
          {/* Day selector */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setWeekStart((d) => addDays(d, -7))}>
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </Button>
            <div className="flex flex-1 justify-center gap-1">
              {days.map((d, i) => {
                const sel = selectedDay === i;
                const tod = isToday(d);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className={cn(
                      "relative flex flex-col items-center py-1.5 px-2.5 sm:px-4 rounded-xl transition-all min-w-[48px]",
                      sel && "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                      !sel && "hover:bg-accent/50",
                    )}
                  >
                    <span className={cn("text-[10px] font-medium uppercase", sel ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {format(d, "EEE")}
                    </span>
                    <span className={cn("text-base font-bold", sel ? "text-primary-foreground" : "text-foreground")}>
                      {format(d, "d")}
                    </span>
                    {!sel && tod && (
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setWeekStart((d) => addDays(d, 7))}>
              <ChevronDown className="w-4 h-4 rotate-90" />
            </Button>
          </div>

          {/* Materials needed */}
          {materialsNeeded.length > 0 && (
            <Collapsible open={materialsOpen} onOpenChange={setMaterialsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-auto py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">Pickup List ({materialsNeeded.length} items)</span>
                  </div>
                  {materialsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-1.5 border-dashed">
                  <CardContent className="p-3">
                    <div className="space-y-1.5">
                      {materialsNeeded.map((m) => (
                        <div key={m.name} className="flex items-center justify-between text-sm">
                          <span className="text-card-foreground">{m.name}</span>
                          <span className="text-muted-foreground font-mono text-xs">{m.qty} {m.unit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Job list */}
          {layoutMode === "vertical" ? (
            <div className="space-y-2">
              {dayJobs.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <CalendarDays className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nothing scheduled for {isToday(selectedDate) ? "today" : format(selectedDate, "EEEE")}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Timeline connector */}
                  <div className="relative">
                    <div className="absolute left-[38px] top-4 bottom-4 w-px bg-border" />
                    <div className="space-y-2 relative">
                      {dayJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Horizontal scroll layout */
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-3 px-3">
              {dayJobs.length === 0 ? (
                <Card className="min-w-[200px] shrink-0">
                  <CardContent className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">No jobs</p>
                  </CardContent>
                </Card>
              ) : (
                dayJobs.map((job) => (
                  <div key={job.id} className="min-w-[260px] max-w-[300px] shrink-0 snap-start">
                    <JobCard job={job} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* WEEK VIEW */
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => setWeekStart((d) => addDays(d, -7))}>
              ← Prev
            </Button>
            <span className="text-sm font-semibold text-muted-foreground">
              {format(weekStart, "d MMM")} – {format(addDays(weekStart, 4), "d MMM")}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setWeekStart((d) => addDays(d, 7))}>
              Next →
            </Button>
          </div>

          {layoutMode === "vertical" ? (
            /* Vertical week: stacked days */
            <div className="space-y-3">
              {weekDays.map(({ date, offset, jobs: dJobs }) => {
                const tod = isToday(date);
                return (
                  <div key={offset}>
                    <div className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-lg mb-1.5",
                      tod && "bg-primary/10"
                    )}>
                      <span className={cn(
                        "text-xs font-bold uppercase",
                        tod ? "text-primary" : "text-muted-foreground"
                      )}>
                        {format(date, "EEE")}
                      </span>
                      <span className={cn(
                        "text-sm font-bold",
                        tod ? "text-primary" : "text-foreground"
                      )}>
                        {format(date, "d MMM")}
                      </span>
                      {tod && <Badge className="bg-primary text-primary-foreground text-[9px] h-4">Today</Badge>}
                      <span className="text-xs text-muted-foreground ml-auto">{dJobs.length} job{dJobs.length !== 1 ? "s" : ""}</span>
                    </div>
                    {dJobs.length === 0 ? (
                      <p className="text-xs text-muted-foreground pl-2 pb-1">— Free</p>
                    ) : (
                      <div className="space-y-1.5">
                        {dJobs.map((job) => <JobCard key={job.id} job={job} compact />)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Horizontal week: side-by-side columns */
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 snap-x">
              {weekDays.map(({ date, offset, jobs: dJobs }) => {
                const tod = isToday(date);
                return (
                  <div key={offset} className={cn(
                    "min-w-[200px] flex-1 shrink-0 snap-start rounded-xl border p-2 space-y-1.5",
                    tod ? "border-primary/30 bg-primary/5" : "border-border"
                  )}>
                    <div className="text-center pb-1 border-b border-border/50">
                      <p className={cn("text-[10px] font-bold uppercase", tod ? "text-primary" : "text-muted-foreground")}>
                        {format(date, "EEE")}
                      </p>
                      <p className={cn("text-lg font-bold", tod ? "text-primary" : "text-foreground")}>{format(date, "d")}</p>
                    </div>
                    {dJobs.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">Free</p>
                    ) : (
                      dJobs.map((job) => <JobCard key={job.id} job={job} compact />)
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
