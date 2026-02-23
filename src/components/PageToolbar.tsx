import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToolbarPosition } from "@/contexts/ToolbarPositionContext";

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
  pageHeading?: React.ReactNode;
}

export function PageToolbar({ tabs, activeTab, onTabChange, children, pageHeading }: PageToolbarProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { position } = useToolbarPosition();

  const headingBar = pageHeading ? (
    <div className="px-4 sm:px-6 py-2 border-b border-border bg-background">
      {pageHeading}
    </div>
  ) : null;

  const isVertical = position === "left" || position === "right";
  const isHorizontal = position === "top" || position === "bottom";

  const homeBtn = (isLarge?: boolean) => (
    <button
      onClick={() => navigate("/")}
      className={cn(
        "flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent shrink-0",
        isLarge ? "w-11 h-11" : "p-2"
      )}
      title="Home"
    >
      <Home className={cn(isLarge ? "w-5 h-5" : "w-4 h-4")} />
    </button>
  );

  // Desktop vertical sidebar
  if (!isMobile && isVertical) {
    return (
      <div className={cn("flex flex-row", position === "right" && "flex-row-reverse")}>
        <nav className={cn(
          "w-[200px] shrink-0 flex flex-col gap-1 py-2 bg-card",
          position === "left" ? "rounded-r-xl border-r border-border" : "rounded-l-xl border-l border-border"
        )}>
          <div className="px-2 mb-1">{homeBtn()}</div>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left min-h-[48px]",
              activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-6 h-6 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <main className="flex-1 min-w-0">
          {headingBar}
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    );
  }

  // Desktop horizontal bar
  if (!isMobile && isHorizontal) {
    const bar = (
      <nav className="flex items-center gap-1 px-2 py-1.5 border-b border-border overflow-x-auto">
        {homeBtn()}
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
      </nav>
    );

    return (
      <div className="flex flex-col">
        {position === "top" && bar}
        {headingBar}
        <main className="flex-1 min-w-0 p-4 sm:p-6">{children}</main>
        {position === "bottom" && bar}
      </div>
    );
  }

  // ── Mobile ──

  // Mobile vertical (left / right)
  if (isVertical) {
    return (
      <div className="flex flex-row min-h-0" style={position === "right" ? { flexDirection: "row-reverse" } : undefined}>
        <nav
          className={cn(
            "w-16 shrink-0 flex flex-col items-center gap-1 py-2 bg-card overflow-y-auto",
            position === "left" ? "rounded-r-xl border-r border-border" : "rounded-l-xl border-l border-border"
          )}
          style={{ minHeight: "calc(100vh - 6rem)" }}
        >
          {homeBtn(true)}
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors shrink-0",
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent"
              )}
              title={label}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </nav>
        <main className="flex-1 min-w-0">
          {headingBar}
          <div className="p-4">{children}</div>
        </main>
      </div>
    );
  }

  // Mobile horizontal (top / bottom)
  const bar = (
    <nav
      className={cn(
        "bg-card flex items-center px-1 py-1 overflow-x-auto gap-0.5",
        position === "bottom" ? "fixed left-0 right-0 bottom-0 z-40 border-t border-border safe-area-pb" : "sticky top-0 z-40 border-b border-border"
      )}
    >
      {homeBtn(true)}
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
    </nav>
  );

  return (
    <div className="flex flex-col">
      {position === "top" && bar}
      {headingBar}
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
