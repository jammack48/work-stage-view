import { addDays, format, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DayStripProps {
  weekStart: Date;
  selectedDay: number;
  onSelectDay: (dayOffset: number) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function DayStrip({ weekStart, selectedDay, onSelectDay, onPrevWeek, onNextWeek }: DayStripProps) {
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={onPrevWeek}>
        <ChevronLeft className="w-4 h-4" />
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
                "flex flex-col items-center py-1.5 px-3 sm:px-4 rounded-xl transition-all min-w-[48px]",
                selected && "bg-primary text-primary-foreground shadow-md scale-105",
                !selected && "hover:bg-accent/50"
              )}
            >
              <span className={cn(
                "text-[10px] font-medium uppercase",
                selected ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {format(d, "EEE")}
              </span>
              <span
                className={cn(
                  "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
                  selected ? "text-primary-foreground" : today ? "bg-primary text-primary-foreground" : "",
                )}
              >
                {format(d, "d")}
              </span>
            </button>
          );
        })}
      </div>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={onNextWeek}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
