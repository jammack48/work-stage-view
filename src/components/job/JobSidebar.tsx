import { ClipboardList, Package, StickyNote, Camera, Clock, FileText, DollarSign, ClipboardCheck, Columns, LayoutGrid, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type JobTab = "overview" | "materials" | "notes" | "photos" | "time" | "quote" | "invoice" | "forms" | "history";

const TABS: { id: JobTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "history", label: "History", icon: History },
  { id: "quote", label: "Quote", icon: DollarSign },
  { id: "materials", label: "Materials", icon: Package },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "time", label: "Time", icon: Clock },
  { id: "forms", label: "Forms", icon: ClipboardCheck },
  { id: "invoice", label: "Invoice", icon: FileText },
];

interface JobSidebarProps {
  activeTab: JobTab;
  onTabChange: (tab: JobTab) => void;
  mobileLayout: "bottom" | "side";
  onMobileLayoutChange: (layout: "bottom" | "side") => void;
}

export function JobSidebar({ activeTab, onTabChange, mobileLayout, onMobileLayoutChange }: JobSidebarProps) {
  const isMobile = useIsMobile();

  // Desktop: fixed left sidebar
  if (!isMobile) {
    return (
      <nav className="w-[200px] shrink-0 flex flex-col gap-1 py-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
              "min-h-[48px]",
              activeTab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    );
  }

  // Mobile: collapsible side
  if (mobileLayout === "side") {
    return (
      <nav className="fixed left-0 top-[calc(3.5rem+2rem)] bottom-0 z-40 w-14 bg-card border-r border-border flex flex-col items-center gap-1 py-2 overflow-y-auto">
        <button
          onClick={() => onMobileLayoutChange("bottom")}
          className="p-2 mb-2 rounded-lg text-muted-foreground hover:bg-accent shrink-0"
        >
          <Columns className="w-4 h-4" />
        </button>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center justify-center w-11 h-11 rounded-lg transition-colors shrink-0",
              activeTab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    );
  }

  // Mobile bottom tab bar (default) — scrollable for 8 tabs
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center px-1 py-1 safe-area-pb overflow-x-auto gap-0.5">
      <button
        onClick={() => onMobileLayoutChange("side")}
        className="p-2 rounded-lg text-muted-foreground hover:bg-accent shrink-0"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-lg transition-colors gap-0.5 shrink-0",
            activeTab === id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[9px] font-medium leading-none">{label}</span>
        </button>
      ))}
    </nav>
  );
}
