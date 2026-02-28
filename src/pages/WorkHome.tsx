import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, ChevronRight, ChevronDown, ChevronUp, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DEMO_JOBS, formatTime, STAFF_COLORS } from "@/components/schedule/scheduleData";
import { getJobDetail } from "@/data/dummyJobDetails";
import { jobs } from "@/data/dummyJobs";
import { DayStrip } from "@/components/schedule/DayStrip";
import { cn } from "@/lib/utils";
import { startOfWeek, addDays, format, isToday } from "date-fns";

const CURRENT_STAFF = "Dave";

const STATUS_COLORS: Record<string, string> = {
  "Scheduled": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "In Progress": "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))]",
  "Invoiced": "bg-green-500/15 text-green-600 dark:text-green-400",
};

export default function WorkHome() {
  const navigate = useNavigate();
  const [view, setView] = useState<"schedule" | "jobs">("schedule");
  const [materialsOpen, setMaterialsOpen] = useState(false);

  // Week navigation
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today, { weekStartsOn: 1 }));
  const todayOffset = Math.max(0, Math.min(6, Math.floor((today.getTime() - weekStart.getTime()) / 86400000)));
  const [selectedDay, setSelectedDay] = useState(todayOffset > 4 ? 0 : todayOffset);

  const selectedDate = addDays(weekStart, selectedDay);
  const isSelectedToday = isToday(selectedDate);

  const staffColor = STAFF_COLORS[CURRENT_STAFF] || "hsl(var(--primary))";

  // Jobs for selected day
  const dayJobs = useMemo(() =>
    DEMO_JOBS
      .filter((j) => j.assignedTo === CURRENT_STAFF && j.dayOffset === selectedDay)
      .sort((a, b) => a.startHour - b.startHour),
    [selectedDay]
  );

  // Materials needed for selected day (aggregated from all jobs)
  const materialsNeeded = useMemo(() => {
    const materialMap = new Map<string, { name: string; qty: number; unit: string }>();
    dayJobs.forEach((schedJob) => {
      const detail = getJobDetail(schedJob.id);
      if (detail) {
        detail.materials.forEach((m) => {
          const existing = materialMap.get(m.name);
          if (existing) {
            existing.qty += m.quantity;
          } else {
            materialMap.set(m.name, { name: m.name, qty: m.quantity, unit: m.unit });
          }
        });
      }
    });
    return Array.from(materialMap.values());
  }, [dayJobs]);

  // All assigned jobs
  const myJobs = jobs.filter((j) =>
    ["In Progress", "Quote Accepted", "To Invoice"].includes(j.stage)
  ).slice(0, 8);

  return (
    <div className="px-3 sm:px-6 py-4 max-w-2xl mx-auto space-y-4 pb-24">
      {/* Greeting */}
      <div>
        <h2 className="text-lg font-bold text-foreground">G'day, {CURRENT_STAFF} 👋</h2>
        <p className="text-sm text-muted-foreground">
          {format(selectedDate, "EEEE, d MMMM")}
          {isSelectedToday && " — Today"}
        </p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setView("schedule")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            view === "schedule" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
        >
          <Clock className="w-4 h-4" /> Schedule
        </button>
        <button
          onClick={() => setView("jobs")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            view === "jobs" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
        >
          <Package className="w-4 h-4" /> My Jobs
        </button>
      </div>

      {view === "schedule" ? (
        <div className="space-y-3">
          {/* Day strip */}
          <DayStrip
            weekStart={weekStart}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onPrevWeek={() => setWeekStart((d) => addDays(d, -7))}
            onNextWeek={() => setWeekStart((d) => addDays(d, 7))}
          />

          {/* Materials needed */}
          {materialsNeeded.length > 0 && (
            <Collapsible open={materialsOpen} onOpenChange={setMaterialsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-auto py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">Materials Needed ({materialsNeeded.length})</span>
                  </div>
                  {materialsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-1">
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

          {/* Job cards */}
          <div className="space-y-2">
            {dayJobs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No jobs scheduled for {isSelectedToday ? "today" : format(selectedDate, "EEEE")}
                </CardContent>
              </Card>
            ) : (
              dayJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="w-full text-left"
                >
                  <Card className="hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: staffColor }}>
                    <CardContent className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground">
                            {formatTime(job.startHour)} – {formatTime(job.startHour + job.durationHours)}
                          </span>
                          <Badge className={cn("text-[10px] border-0", STATUS_COLORS[job.status] || "bg-muted text-muted-foreground")}>
                            {job.status}
                          </Badge>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-card-foreground">{job.jobName}</p>
                      <p className="text-xs text-muted-foreground">{job.client}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{job.address}</span>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Jobs</h3>
          {myJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="w-full text-left"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-card-foreground">{job.jobName}</p>
                    <p className="text-xs text-muted-foreground">{job.client}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">{job.stage}</Badge>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
