import { Home, Users, DollarSign, FileText, Settings, Columns, LayoutGrid, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDemoData } from "@/contexts/DemoDataContext";

export type HomeView = "pipeline" | "customers" | "quotes" | "invoices" | "servicing" | "settings";


interface HomeSidebarProps {
  activeView: HomeView;
  onViewChange: (view: HomeView) => void;
  mobileLayout: "bottom" | "side";
  onMobileLayoutChange: (layout: "bottom" | "side") => void;
}

export function HomeSidebar({ activeView, onViewChange, mobileLayout, onMobileLayoutChange }: HomeSidebarProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { jobs } = useDemoData();
  const unreadCount = jobs.filter((j) => j.hasUnread).length;

  const tabs: { id: HomeView; label: string; icon: React.ElementType; path?: string; badge?: number }[] = [
    { id: "pipeline", label: "Pipeline", icon: Home, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: "customers", label: "Customers", icon: Users, path: "/customers" },
    { id: "quotes", label: "Quotes", icon: DollarSign },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "servicing", label: "Servicing", icon: Wrench, path: "/servicing" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleClick = (tab: (typeof tabs)[number]) => {
    if (tab.path) {
      navigate(tab.path);
    } else {
      onViewChange(tab.id);
    }
  };

  // Desktop: fixed left sidebar
  if (!isMobile) {
    return (
      <nav className="w-[200px] shrink-0 flex flex-col gap-1 py-2">
        {tabs.map(({ id, label, icon: Icon, path, badge }) => (
          <button
            key={id}
            onClick={() => handleClick({ id, label, icon: Icon, path })}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left relative",
              "min-h-[48px]",
              activeView === id && !path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="relative shrink-0">
              <Icon className="w-5 h-5" />
              {badge && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center animate-wiggle">
                  {badge}
                </span>
              )}
            </div>
            {label}
          </button>
        ))}
      </nav>
    );
  }

  // Mobile: collapsible side
  if (mobileLayout === "side") {
    return (
      <nav className="fixed left-0 top-[3.5rem] bottom-0 z-40 w-14 bg-card border-r border-border flex flex-col items-center gap-1 py-2 overflow-y-auto">
        <button
          onClick={() => onMobileLayoutChange("bottom")}
          className="p-2 mb-2 rounded-lg text-muted-foreground hover:bg-accent shrink-0"
        >
          <Columns className="w-4 h-4" />
        </button>
        {tabs.map(({ id, label, icon: Icon, path, badge }) => (
          <button
            key={id}
            onClick={() => handleClick({ id, label, icon: Icon, path })}
            className={cn(
              "flex flex-col items-center justify-center w-11 h-11 rounded-lg transition-colors shrink-0 relative",
              activeView === id && !path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
            title={label}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {badge && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    );
  }

  // Mobile bottom tab bar
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center px-1 py-1 safe-area-pb overflow-x-auto gap-0.5">
      <button
        onClick={() => onMobileLayoutChange("side")}
        className="p-2 rounded-lg text-muted-foreground hover:bg-accent shrink-0"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      {tabs.map(({ id, label, icon: Icon, path, badge }) => (
        <button
          key={id}
          onClick={() => handleClick({ id, label, icon: Icon, path })}
          className={cn(
            "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-lg transition-colors gap-0.5 shrink-0",
            activeView === id && !path
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          <div className="relative">
            <Icon className="w-5 h-5" />
            {badge && (
              <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold flex items-center justify-center">
                {badge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium leading-none">{label}</span>
        </button>
      ))}
    </nav>
  );
}
