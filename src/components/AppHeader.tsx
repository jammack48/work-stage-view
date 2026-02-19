import { useNavigate, useLocation } from "react-router-dom";
import { Zap, Users, Settings as SettingsIcon, Sun, Moon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  isDark: boolean;
  onToggleDark: () => void;
  children?: React.ReactNode;
}

export function AppHeader({ title = "Toolbelt", showBack, backTo = "/", isDark, onToggleDark, children }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="px-4 sm:px-6 py-3 border-b border-border bg-card flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {showBack && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => navigate(backTo)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <Zap className="w-5 h-5 text-primary shrink-0" />
        <h1 className="text-xl font-bold tracking-tight text-card-foreground truncate">{title}</h1>
        {children}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className={cn("h-8 px-2 gap-1.5 text-xs", isActive("/") && location.pathname === "/" && "bg-accent")}
        >
          <Zap className="w-4 h-4" />
          {!isMobile && "Pipeline"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/customers")}
          className={cn("h-8 px-2 gap-1.5 text-xs", isActive("/customer") && "bg-accent")}
        >
          <Users className="w-4 h-4" />
          {!isMobile && "Customers"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/settings")}
          className={cn("h-8 px-2 gap-1.5 text-xs", isActive("/settings") && "bg-accent")}
        >
          <SettingsIcon className="w-4 h-4" />
          {!isMobile && "Settings"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onToggleDark} className="h-8 w-8 p-0">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
