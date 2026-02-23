import { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type ToolbarPosition = "left" | "right" | "top" | "bottom";

const POSITION_CYCLE: ToolbarPosition[] = ["left", "bottom", "right", "top"];

function getStoredPosition(): ToolbarPosition {
  try {
    const v = localStorage.getItem("toolbar-position");
    if (v && POSITION_CYCLE.includes(v as ToolbarPosition)) return v as ToolbarPosition;
  } catch {}
  return "left";
}

interface TabDef {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface PageToolbarProps {
  tabs: TabDef[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

export function PageToolbar({ tabs, activeTab, onTabChange, children }: PageToolbarProps) {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState<ToolbarPosition>(getStoredPosition);

  useEffect(() => {
    localStorage.setItem("toolbar-position", position);
  }, [position]);

  const cyclePosition = () => {
    const idx = POSITION_CYCLE.indexOf(position);
    setPosition(POSITION_CYCLE[(idx + 1) % POSITION_CYCLE.length]);
  };

  const isVertical = position === "left" || position === "right";
  const isHorizontal = position === "top" || position === "bottom";

  // Toggle button
  const toggleBtn = (
    <button
      onClick={cyclePosition}
      className="p-2 rounded-lg text-muted-foreground hover:bg-accent shrink-0"
      title={`Toolbar: ${position}`}
    >
      <LayoutGrid className="w-4 h-4" />
    </button>
  );

  // Desktop vertical sidebar
  if (!isMobile && isVertical) {
    return (
      <div className={cn("flex flex-row", position === "right" && "flex-row-reverse")}>
        <nav className="w-[200px] shrink-0 flex flex-col gap-1 py-2">
          
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left min-h-[48px]",
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </button>
          ))}
          <div className="mt-auto px-2 pt-2">{toggleBtn}</div>
        </nav>
        <main className="flex-1 min-w-0 p-4 sm:p-6">{children}</main>
      </div>
    );
  }

  // Desktop horizontal bar
  if (!isMobile && isHorizontal) {
    const bar = (
      <nav className="flex items-center gap-1 px-2 py-1.5 border-b border-border overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
              activeTab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
        <div className="ml-auto shrink-0">{toggleBtn}</div>
      </nav>
    );

    return (
      <div className="flex flex-col">
        {position === "top" && bar}
        <main className="flex-1 min-w-0 p-4 sm:p-6">{children}</main>
        {position === "bottom" && bar}
      </div>
    );
  }

  // ── Mobile ──

  // Mobile vertical (left / right) — use sticky so it flows below header
  if (isVertical) {
    return (
      <div className="flex flex-row min-h-0" style={position === "right" ? { flexDirection: "row-reverse" } : undefined}>
        <nav className="sticky top-0 w-14 shrink-0 flex flex-col items-center gap-1 py-2 bg-card border-border overflow-y-auto self-start h-[calc(100vh-8rem)]"
          style={position === "left" ? { borderRight: "1px solid hsl(var(--border))" } : { borderLeft: "1px solid hsl(var(--border))" }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
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
          <div className="mt-auto">{toggleBtn}</div>
        </nav>
        <main className="flex-1 min-w-0 p-4">
          {children}
        </main>
      </div>
    );
  }

  // Mobile horizontal (top / bottom) — top is normal flow, bottom is fixed
  const bar = (
    <nav
      className={cn(
        "bg-card flex items-center px-1 py-1 overflow-x-auto gap-0.5",
        position === "bottom" ? "fixed left-0 right-0 bottom-0 z-40 border-t border-border safe-area-pb" : "sticky top-0 z-40 border-b border-border"
      )}
    >
      {tabs.map(({ id, label, icon: Icon }) => (
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
      <div className="ml-auto shrink-0">{toggleBtn}</div>
    </nav>
  );

  return (
    <div className="flex flex-col">
      {position === "top" && bar}
      <main
        className={cn(
          "flex-1 min-w-0 p-4",
          position === "bottom" && "pb-24"
        )}
      >
        {children}
      </main>
      {position === "bottom" && bar}
    </div>
  );
}
