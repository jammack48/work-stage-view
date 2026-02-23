import { ArrowLeft, Phone, MessageSquare, Navigation, ChevronDown, Wrench, Home, Users, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JobDetail } from "@/data/dummyJobDetails";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemePicker } from "@/components/ThemePicker";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const location = useLocation();
  const [showAddress, setShowAddress] = useState(false);
  const { isDark, setIsDark } = useTheme();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-3 sm:px-5">
      <div className="flex items-center justify-between h-14 gap-2">
        {/* Left: Back + Title + Job actions */}
        <div className="flex items-center gap-1 min-w-0 shrink">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 shrink-0"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-sm sm:text-base font-bold text-card-foreground truncate max-w-[120px] sm:max-w-[200px]">
            {job.jobName}
          </h1>

          {/* Job-specific actions — hidden on mobile to reduce clutter */}
          <div className="hidden sm:flex items-center gap-0.5 ml-1">
            <span className="text-sm font-bold text-card-foreground px-1">
              ${job.value.toLocaleString()}
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Navigation className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-1.5 gap-1 text-xs">
              <span className={cn("w-2 h-2 rounded-full shrink-0", statusColor(job.stage))} />
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className={cn("h-9 w-9 p-0 rounded-lg text-muted-foreground hover:bg-accent", location.pathname === "/" && "bg-accent")}
            title="Home"
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/customers")}
            className={cn("h-9 w-9 p-0 rounded-lg text-muted-foreground hover:bg-accent", isActive("/customer") && "bg-accent")}
            title="Customers"
          >
            <Users className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            className={cn("h-9 w-9 p-0 rounded-lg text-muted-foreground hover:bg-accent", isActive("/settings") && "bg-accent")}
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>
          <ThemePicker />
          <Button variant="ghost" size="sm" onClick={() => setIsDark(!isDark)} className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:bg-accent">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
