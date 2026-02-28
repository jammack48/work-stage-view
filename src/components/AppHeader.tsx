import { useNavigate, useLocation } from "react-router-dom";
import { Wrench, Users, Settings as SettingsIcon, GraduationCap, Shield, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemePicker } from "@/components/ThemePicker";
import { useTutorial } from "@/contexts/TutorialContext";
import { useAppMode } from "@/contexts/AppModeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tutorialOn, setTutorialOn } = useTutorial();
  const { isWorkMode, setMode, clearMode } = useAppMode();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="px-3 sm:px-6 py-2 sm:py-3 border-b border-border bg-background flex items-center justify-between">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity">
        {isWorkMode ? (
          <Wrench className="w-5 h-5 text-primary shrink-0" />
        ) : (
          <Shield className="w-5 h-5 text-primary shrink-0" />
        )}
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground/80 truncate hidden min-[360px]:block">
          {isWorkMode ? "Toolbelt — Work" : "Tradie Toolbelt"}
        </h1>
      </button>
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {/* Mode switch */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearMode();
            navigate("/");
          }}
          className="h-9 rounded-lg gap-1.5 text-muted-foreground hover:bg-accent"
          title="Switch mode"
        >
          <ArrowLeftRight className="w-4 h-4" />
          {!isMobile && <span className="text-xs font-medium">{isWorkMode ? "Manage" : "Work"}</span>}
        </Button>

        {!isWorkMode && (
          <>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTutorialOn(!tutorialOn)}
              className={cn(
                "h-9 rounded-lg gap-1.5",
                tutorialOn
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "text-muted-foreground hover:bg-accent"
              )}
              title="Toggle tutorial mode"
            >
              <GraduationCap className="w-5 h-5" />
              {!isMobile && <span className="text-xs font-medium">Tutorial</span>}
            </Button>
          </>
        )}
        <ThemePicker />
      </div>
    </header>
  );
}
