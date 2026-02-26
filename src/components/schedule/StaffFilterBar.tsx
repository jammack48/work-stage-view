import { cn } from "@/lib/utils";
import { STAFF, STAFF_COLORS } from "./scheduleData";

interface StaffFilterBarProps {
  selectedStaff: string[];
  onSelectionChange: (staff: string[]) => void;
}

export function StaffFilterBar({ selectedStaff, onSelectionChange }: StaffFilterBarProps) {
  const allSelected = selectedStaff.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-1">
      <button
        onClick={() => onSelectionChange([])}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
          allSelected
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
        )}
      >
        All Staff
      </button>
      {STAFF.map((name) => {
        const active = selectedStaff.includes(name);
        return (
          <button
            key={name}
            onClick={() => {
              if (active) {
                const next = selectedStaff.filter((s) => s !== name);
                onSelectionChange(next);
              } else {
                onSelectionChange([...selectedStaff, name]);
              }
            }}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
            )}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: STAFF_COLORS[name] }}
            />
            {name}
          </button>
        );
      })}
    </div>
  );
}
