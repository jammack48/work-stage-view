import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToolbarPosition } from "@/contexts/ToolbarPositionContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { sidebarTooltips } from "@/data/tutorialContent";
import { TutorialBanner } from "@/components/TutorialBanner";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface TabDef {
  id: string;
  label: string;
  icon: React.ElementType;
}

/** Tab IDs that show a notification red dot */
const BADGE_TABS = new Set(["messages", "sequences"]);

interface PageToolbarProps {
  tabs: TabDef[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  pageHeading?: React.ReactNode;
  /** ID of the common-nav tab to highlight for the current page (e.g. "customers") */
  currentPage?: string;
  /** Override tutorial key (e.g. "manager" when showing manager mode on pipeline route) */
  tutorialKey?: string;
}

export function PageToolbar({ tabs, activeTab, onTabChange, children, pageHeading, currentPage, tutorialKey }: PageToolbarProps) {
  const isMobile = useIsMobile();
  const { position } = useToolbarPosition();
  const { tutorialOn } = useTutorial();

  const tutorialBanner = tutorialOn ? <TutorialBanner overrideKey={tutorialKey} /> : null;
  const isActive = (id: string) => activeTab === id || currentPage === id;

  const headingBar = pageHeading ? (
    <div className="px-4 sm:px-6 py-2 border-b border-border bg-background">
      {pageHeading}
    </div>
  ) : null;

  const isVertical = position === "left" || position === "right";
  const isHorizontal = position === "top" || position === "bottom";


  // Desktop vertical sidebar
  if (!isMobile && isVertical) {
    return (
      <div className={cn("flex flex-row", position === "right" && "flex-row-reverse")}>
        <nav className={cn(
          "w-[200px] shrink-0 flex flex-col gap-1 py-2 bg-card",
          position === "left" ? "rounded-r-xl border-r border-border" : "rounded-l-xl border-l border-border"
        )}>
          
          {tabs.map(({ id, label, icon: Icon }) => {
            const tip = tutorialOn ? sidebarTooltips[id] : undefined;
            const btn = (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left min-h-[48px]",
                isActive(id)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="relative">
                  <Icon className="w-6 h-6 shrink-0" />
                  {BADGE_TABS.has(id) && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />}
                </span>
                {label}
              </button>
            );
            if (tip) {
              return (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>{btn}</TooltipTrigger>
                  <TooltipContent side={position === "left" ? "right" : "left"}>
                    <p className="text-xs">{tip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }
            return btn;
          })}
        </nav>
        <main className="flex-1 min-w-0">
          {headingBar}
          {tutorialBanner}
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    );
  }

  // Desktop horizontal bar
  if (!isMobile && isHorizontal) {
    const bar = (
      <nav className="flex items-center gap-1 px-2 py-1.5 border-b border-border overflow-x-auto">
        
        {tabs.map(({ id, label, icon: Icon }) => {
          const tip = tutorialOn ? sidebarTooltips[id] : undefined;
          const btn = (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                isActive(id)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="relative">
                <Icon className="w-4 h-4 shrink-0" />
                {BADGE_TABS.has(id) && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />}
              </span>
              {label}
            </button>
          );
          if (tip) {
            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side={position === "top" ? "bottom" : "top"}>
                  <p className="text-xs">{tip}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
          return btn;
        })}
      </nav>
    );

    return (
      <div className="flex flex-col">
        {position === "top" && bar}
        {headingBar}
        <main className="flex-1 min-w-0">
          {tutorialBanner}
          <div className="p-4 sm:p-6">{children}</div>
        </main>
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
            "w-16 shrink-0 flex flex-col items-center gap-1 py-2 bg-card overflow-y-auto sticky top-0 self-start max-h-screen",
            position === "left" ? "rounded-r-xl border-r border-border" : "rounded-l-xl border-l border-border"
          )}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center w-12 min-h-[48px] rounded-lg transition-colors shrink-0 gap-0.5 px-0.5",
                isActive(id)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent"
              )}
              title={label}
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                {BADGE_TABS.has(id) && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />}
              </span>
              <span className="text-[8px] font-medium leading-none truncate w-full text-center">{label}</span>
            </button>
          ))}
        </nav>
        <main className="flex-1 min-w-0">
          {headingBar}
          {tutorialBanner}
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
      
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-lg transition-colors gap-0.5 shrink-0",
            isActive(id)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          <span className="relative">
            <Icon className="w-5 h-5" />
            {BADGE_TABS.has(id) && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />}
          </span>
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
          "flex-1 min-w-0",
          position === "bottom" && "pb-24"
        )}
      >
        {tutorialBanner}
        <div className="p-4">{children}</div>
      </main>
      {position === "bottom" && bar}
    </div>
  );
}
