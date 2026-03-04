import { addDays, format, isToday, startOfWeek, differenceInCalendarWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DayStripProps {
  weekStart: Date;
  selectedDay: number;
  onSelectDay: (dayOffset: number) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onJumpToToday?: () => void;
}

export function DayStrip({ weekStart, selectedDay, onSelectDay, onPrevWeek, onNextWeek, onJumpToToday }: DayStripProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const now = new Date();
  const todayWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const isCurrentWeek = differenceInCalendarWeeks(weekStart, todayWeekStart, { weekStartsOn: 1 }) === 0;
  const todayOffset = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const isTodaySelected = isCurrentWeek && selectedDay === todayOffset;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-10 w-10 sm:h-8 sm:w-8 p-0 shrink-0" onClick={onPrevWeek}>
          <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
        </Button>
        <div className="flex flex-1 justify-center gap-1">
          {days.map((d, i) => {
            const today = isToday(d);
            const selected = selectedDay === i;
            return (
              <button
                key={i}
                onClick={() => onSelectDay(i)}
                className={cn(
                  "relative flex flex-col items-center py-2 px-3 sm:px-5 rounded-xl transition-colors min-w-[56px] font-bold border-2 border-transparent",
                  selected && "bg-primary text-primary-foreground ring-2 ring-white/30 shadow-[0_0_20px_hsl(var(--primary)/0.5)] border-white/20",
                  !selected && "hover:bg-accent/50"
                )}
              >
                <span className={cn(
                  "text-[10px] font-medium uppercase",
                  selected ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {format(d, "EEE")}
                </span>
                <span
                  className={cn(
                    "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
                    selected ? "text-primary-foreground" : "",
                  )}
                >
                  {format(d, "d")}
                </span>
                {!selected && today && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" className="h-10 w-10 sm:h-8 sm:w-8 p-0 shrink-0" onClick={onNextWeek}>
          <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
        </Button>
      </div>
      {!isTodaySelected && onJumpToToday && (
        <div className="flex justify-center">
          <button
            onClick={onJumpToToday}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors px-2 py-0.5"
          >
            ← Jump to Today
          </button>
        </div>
      )}
    </div>
  );
}
