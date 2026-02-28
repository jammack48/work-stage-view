import { useState, useMemo } from "react";
import { startOfWeek, addWeeks, subWeeks, addDays, format, isToday } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { DayStrip } from "@/components/schedule/DayStrip";
import { TimeGridDesktop } from "@/components/schedule/TimeGridDesktop";
import { TimeGridMobile } from "@/components/schedule/TimeGridMobile";
import { DEMO_JOBS } from "@/components/schedule/scheduleData";
import { Package, ChevronUp, ChevronDown, CalendarDays, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { getJobDetail } from "@/data/dummyJobDetails";
import { cn } from "@/lib/utils";

const CURRENT_STAFF = "Dave";

type ViewMode = "day" | "week";

export default function WorkHome() {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 4 ? diff : 0;
  });

  const selectedDate = addDays(weekStart, selectedDay);
  const weekEnd = addDays(weekStart, 4);

  // Filter to only current staff's jobs
  const myJobs = useMemo(
    () => DEMO_JOBS.filter((j) => j.assignedTo === CURRENT_STAFF),
    []
  );

  // Materials for selected day
  const dayJobs = useMemo(() => myJobs.filter((j) => j.dayOffset === selectedDay), [myJobs, selectedDay]);
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

  return (
    <div className="px-3 sm:px-6 py-4 max-w-5xl mx-auto space-y-3 pb-24">
      {/* Greeting + view toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">G'day, {CURRENT_STAFF} 👋</h2>
          <p className="text-sm text-muted-foreground">
            {viewMode === "day"
              ? `${format(selectedDate, "EEEE, d MMMM")}${isToday(selectedDate) ? " — Today" : ""}`
              : `${format(weekStart, "d MMM")} – ${format(weekEnd, "d MMM")}`}
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("day")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "day" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <LayoutList className="w-3.5 h-3.5" /> Day
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "week" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" /> Week
          </button>
        </div>
      </div>

      {/* Day strip */}
      <DayStrip
        weekStart={weekStart}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrevWeek={() => setWeekStart(subWeeks(weekStart, 1))}
        onNextWeek={() => setWeekStart(addWeeks(weekStart, 1))}
      />

      {/* Materials pickup list (day view only) */}
      {viewMode === "day" && materialsNeeded.length > 0 && (
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

      {/* Time grid — same as manager schedule but filtered to my jobs */}
      {viewMode === "day" ? (
        <TimeGridMobile jobs={myJobs} dayOffset={selectedDay} onDayChange={setSelectedDay} />
      ) : (
        isMobile ? (
          <TimeGridMobile jobs={myJobs} dayOffset={selectedDay} onDayChange={setSelectedDay} />
        ) : (
          <TimeGridDesktop weekStart={weekStart} jobs={myJobs} selectedDay={selectedDay} />
        )
      )}
    </div>
  );
}
