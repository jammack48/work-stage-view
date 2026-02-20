import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JobDetail } from "@/data/dummyJobDetails";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemePicker } from "@/components/ThemePicker";

interface JobTopStripProps {
  job: JobDetail;
}

function statusColor(stage: string) {
  if (stage.includes("Paid")) return "bg-[hsl(var(--status-green))] text-white";
  if (stage.includes("Invoice") || stage.includes("Progress")) return "bg-[hsl(var(--status-orange))] text-white";
  if (stage.includes("Lead")) return "bg-[hsl(var(--status-red))] text-white";
  return "bg-[hsl(var(--stage-header))] text-white";
}

export function JobTopStrip({ job }: JobTopStripProps) {
  const navigate = useNavigate();
  const [showAddress, setShowAddress] = useState(false);
  const { isDark, setIsDark } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-3 sm:px-5">
      <div className="flex items-center justify-between h-14 gap-2">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-2 min-w-0 shrink">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 shrink-0"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-sm sm:text-base font-bold text-card-foreground truncate">
            {job.jobName}
          </h1>
        </div>

        {/* Center: Status + Client */}
        <div className="hidden sm:flex items-center gap-3 min-w-0">
          <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap", statusColor(job.stage))}>
            {job.stage}
          </span>
          <button
            className="text-sm text-muted-foreground hover:text-card-foreground transition-colors truncate relative"
            onClick={() => setShowAddress((s) => !s)}
          >
            {job.client}
            {showAddress && job.address && (
              <span className="absolute top-full left-0 mt-1 bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg z-50">
                {job.address}
              </span>
            )}
          </button>
        </div>

        {/* Right: Value + Theme + Dark mode */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="text-sm font-bold text-card-foreground hidden sm:inline">
            ${job.value.toLocaleString()}
          </span>
          <ThemePicker />
          <Button variant="ghost" size="sm" onClick={() => setIsDark(!isDark)} className="h-8 w-8 p-0">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile: second row with status + client + value */}
      <div className="flex sm:hidden items-center gap-2 pb-2 -mt-1">
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", statusColor(job.stage))}>
          {job.stage}
        </span>
        <button
          className="text-xs text-muted-foreground truncate"
          onClick={() => setShowAddress((s) => !s)}
        >
          {job.client || "No client"}
        </button>
        <span className="text-xs font-bold text-card-foreground ml-auto">
          ${job.value.toLocaleString()}
        </span>
      </div>
    </header>
  );
}
