import { cn } from "@/lib/utils";

type ViewDays = 1 | 3 | 5;

interface DayViewToggleProps {
  value: ViewDays;
  onChange: (v: ViewDays) => void;
}

const OPTIONS: { value: ViewDays; label: string }[] = [
  { value: 1, label: "1 Day" },
  { value: 3, label: "3 Days" },
  { value: 5, label: "5 Days" },
];

export function DayViewToggle({ value, onChange }: DayViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
            value === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
