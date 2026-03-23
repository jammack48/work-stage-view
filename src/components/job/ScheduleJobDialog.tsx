import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STAFF, STAFF_COLORS } from "@/components/schedule/scheduleData";
import { toast } from "@/hooks/use-toast";

interface ScheduleJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobName: string;
  client: string;
  jobId: string;
  onScheduled?: () => void;
}

const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const hour = 7 + i;
  const label = hour === 12 ? "12:00 pm" : hour < 12 ? `${hour}:00 am` : `${hour - 12}:00 pm`;
  return { value: String(hour), label };
});

export function ScheduleJobDialog({ open, onOpenChange, jobName, client, jobId, onScheduled }: ScheduleJobDialogProps) {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("8");

  const toggleStaff = (name: string) => {
    setSelectedStaff((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleConfirm = () => {
    if (selectedStaff.length === 0 || !date) return;
    toast({
      title: "Job scheduled",
      description: `${jobName} assigned to ${selectedStaff.join(", ")} on ${format(date, "EEE d MMM")} at ${TIME_SLOTS.find(t => t.value === startTime)?.label}`,
    });
    onOpenChange(false);
    onScheduled?.();
  };

  const canConfirm = selectedStaff.length > 0 && !!date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Schedule Job
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {jobName} — {client}
          </p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Staff Selection */}
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <Users className="w-4 h-4" /> Select Staff
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STAFF.map((name) => {
                const isSelected = selectedStaff.includes(name);
                const color = STAFF_COLORS[name] || "hsl(var(--primary))";
                return (
                  <button
                    key={name}
                    onClick={() => toggleStaff(name)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="flex-1">{name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <CalendarIcon className="w-4 h-4" /> Select Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "EEEE, d MMMM yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Start Time */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Start Time</label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Schedule Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
