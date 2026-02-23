import { useNavigate, useLocation } from "react-router-dom";
import { Wrench, Users, Settings as SettingsIcon, Sun, Moon, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemePicker } from "@/components/ThemePicker";
import { useToolbarPosition } from "@/contexts/ToolbarPositionContext";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, setIsDark } = useTheme();
  const { cyclePosition, position } = useToolbarPosition();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="px-4 sm:px-6 py-3 border-b border-border bg-card flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        <Wrench className="w-5 h-5 text-primary shrink-0" />
        <h1 className="text-xl font-bold tracking-tight text-card-foreground truncate">Toolbelt</h1>
      </div>
      <div className="flex items-center gap-1 shrink-0">
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
          onClick={cyclePosition}
          className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:bg-accent"
          title={`Toolbar: ${position}`}
        >
          <LayoutGrid className="w-5 h-5" />
        </Button>
        <ThemePicker />
        <Button variant="ghost" size="sm" onClick={() => setIsDark(!isDark)} className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:bg-accent">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
