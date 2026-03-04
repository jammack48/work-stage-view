import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { startOfWeek, addWeeks, subWeeks, addDays, subDays, format, isToday } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { DayStrip } from "@/components/schedule/DayStrip";
import { TimeGridDesktop } from "@/components/schedule/TimeGridDesktop";
import { TimeGrid3Day } from "@/components/schedule/TimeGrid3Day";
import { TimeGridMobile } from "@/components/schedule/TimeGridMobile";
import { generateWeekJobs } from "@/components/schedule/scheduleData";
import { Package, ChevronUp, ChevronDown, CalendarDays, LayoutList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { getJobDetail } from "@/data/dummyJobDetails";
import { cn } from "@/lib/utils";

const CURRENT_STAFF = "Dave";

type ViewMode = "day" | "week";

export default function WorkHome() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 6 ? diff : 0;
  });
  // 3-day window: track the absolute start date
  const [threeDayStart, setThreeDayStart] = useState(() => {
    const today = new Date();
    // Snap to nearest 3-day block: Mon, Thu, Sun
    const ws = startOfWeek(today, { weekStartsOn: 1 });
    const dayInWeek = Math.floor((today.getTime() - ws.getTime()) / (1000 * 60 * 60 * 24));
    const blockStart = Math.floor(dayInWeek / 3) * 3;
    return addDays(ws, blockStart);
  });

  const selectedDate = addDays(weekStart, selectedDay);
  const weekEnd = addDays(weekStart, 6);

  // Filter to only current staff's jobs
  const weekJobs = useMemo(() => generateWeekJobs(weekStart), [weekStart]);
  const myJobs = useMemo(
    () => weekJobs.filter((j) => j.assignedTo === CURRENT_STAFF),
    [weekJobs]
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
    <div className={cn(
      "max-w-5xl mx-auto flex flex-col",
      isMobile ? "h-[calc(100dvh-48px-56px)] overflow-x-hidden" : "px-6 py-4 space-y-3 pb-24"
    )}>
      {/* Fixed controls section */}
      <div className={cn("shrink-0 space-y-3", isMobile ? "px-3 pt-4" : "")}>
        {/* Greeting + view toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">G'day, {CURRENT_STAFF} 👋</h2>
            <p className="text-sm text-muted-foreground">
              {viewMode === "day"
                ? `${format(selectedDate, "EEEE, d MMMM")}${isToday(selectedDate) ? " — Today" : ""}`
                : `${format(threeDayStart, "d MMM")} – ${format(addDays(threeDayStart, 2), "d MMM")}`}
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
              <CalendarDays className="w-3.5 h-3.5" /> 3 Days
            </button>
          </div>
        </div>

        {/* Day strip */}
        <DayStrip
          weekStart={weekStart}
          selectedDay={selectedDay}
          onSelectDay={(d) => {
            setSelectedDay(d);
            // Snap the 3-day window to include the selected day
            if (isMobile && viewMode === "week") {
              const blockStart = Math.floor(d / 3) * 3;
              setThreeDayStart(addDays(weekStart, blockStart));
            }
          }}
          onPrevWeek={() => setWeekStart(subWeeks(weekStart, 1))}
          onNextWeek={() => setWeekStart(addWeeks(weekStart, 1))}
          onJumpToToday={() => {
            const today = new Date();
            setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
            const diff = Math.min(6, Math.max(0, today.getDay() === 0 ? 6 : today.getDay() - 1));
            setSelectedDay(diff);
          }}
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
      </div>

      {/* Scrollable time grid */}
      <div className={cn(
        isMobile ? "flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 mt-3" : ""
      )}>
        {viewMode === "day" ? (
          <TimeGridMobile jobs={myJobs} dayOffset={selectedDay} onDayChange={setSelectedDay} onNextWeek={() => setWeekStart(addWeeks(weekStart, 1))} onPrevWeek={() => setWeekStart(subWeeks(weekStart, 1))} />
        ) : isMobile ? (
          <TimeGrid3Day
            dates={[threeDayStart, addDays(threeDayStart, 1), addDays(threeDayStart, 2)] as [Date, Date, Date]}
            staffFilter="Dave"
            selectedDate={selectedDate}
            onSwipe={(dir) => {
              if (dir === "right") {
                setThreeDayStart(addDays(threeDayStart, 3));
              } else {
                setThreeDayStart(subDays(threeDayStart, 3));
              }
            }}
          />
        ) : (
          <TimeGridDesktop
            weekStart={weekStart}
            jobs={myJobs}
            selectedDay={selectedDay}
          />
        )}
      </div>

      {/* Floating New Job button */}
      <button
        onClick={() => navigate("/new-job")}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
