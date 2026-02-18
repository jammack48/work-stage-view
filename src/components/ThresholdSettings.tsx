import { useState } from "react";
import { Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useThresholds } from "@/contexts/ThresholdContext";

interface ThresholdSettingsProps {
  stage: string;
}

export function ThresholdSettings({ stage }: ThresholdSettingsProps) {
  const { getThresholds, setThresholds } = useThresholds();
  const current = getThresholds(stage);
  const [open, setOpen] = useState(false);
  const [greenMax, setGreenMax] = useState(current.greenMax);
  const [orangeMax, setOrangeMax] = useState(current.orangeMax);

  const handleApply = () => {
    if (greenMax > 0 && orangeMax > greenMax) {
      setThresholds(stage, { greenMax, orangeMax });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(v) => {
      setOpen(v);
      if (v) {
        const t = getThresholds(stage);
        setGreenMax(t.greenMax);
        setOrangeMax(t.orangeMax);
      }
    }}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-md hover:bg-white/20 transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-primary-foreground/70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-3 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold text-card-foreground">Priority Thresholds (days)</p>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[hsl(var(--status-green))] shrink-0" />
          <span className="text-xs text-muted-foreground w-12">0 –</span>
          <input
            type="number"
            min={1}
            max={orangeMax - 1}
            value={greenMax}
            onChange={(e) => setGreenMax(Number(e.target.value))}
            className="w-14 h-7 rounded-md border border-input bg-background px-2 text-xs text-card-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[hsl(var(--status-orange))] shrink-0" />
          <span className="text-xs text-muted-foreground w-12">{greenMax + 1} –</span>
          <input
            type="number"
            min={greenMax + 1}
            value={orangeMax}
            onChange={(e) => setOrangeMax(Number(e.target.value))}
            className="w-14 h-7 rounded-md border border-input bg-background px-2 text-xs text-card-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[hsl(var(--status-red))] shrink-0" />
          <span className="text-xs text-muted-foreground">{orangeMax + 1}d+</span>
        </div>

        <button
          onClick={handleApply}
          className="w-full h-7 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          Apply
        </button>
      </PopoverContent>
    </Popover>
  );
}
