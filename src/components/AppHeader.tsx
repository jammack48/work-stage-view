import { useNavigate } from "react-router-dom";
import { Zap, Sun, Moon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemePicker } from "@/components/ThemePicker";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  children?: React.ReactNode;
}

export function AppHeader({ title = "Toolbelt", showBack, backTo = "/", children }: AppHeaderProps) {
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();

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
        <ThemePicker />
        <Button variant="ghost" size="sm" onClick={() => setIsDark(!isDark)} className="h-8 w-8 p-0">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
