import { useState, useEffect } from "react";
import { STAGES, jobsByStage, type Stage } from "@/data/dummyJobs";
import { StageColumn } from "@/components/StageColumn";
import { ExpandedStagePanel } from "@/components/ExpandedStagePanel";
import { Zap, ChevronRight, LayoutGrid, Columns, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


type Layout = "horizontal" | "vertical";

const Index = () => {
  const [expandedStage, setExpandedStage] = useState<Stage | null>(null);
  const [layout, setLayout] = useState<Layout>("horizontal");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  const handleToggle = (stage: Stage) => {
    setExpandedStage((prev) => (prev === stage ? null : stage));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="px-6 py-3 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-card-foreground">
            Toolbelt
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDark((d) => !d)}
          className="h-8 w-8 p-0"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </header>

      <main className="p-4 lg:p-6 space-y-4">
        {/* Pipeline heading with flow arrows + layout toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <span className="text-card-foreground font-bold text-base">Pipeline Dashboard</span>
            <div className="flex items-center gap-0.5 ml-3 opacity-50">
              <span className="text-xs">Lead</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <ChevronRight className="w-3.5 h-3.5 -ml-2" />
              <ChevronRight className="w-3.5 h-3.5 -ml-2" />
              <span className="text-xs">Paid</span>
            </div>
          </div>

          {/* Layout toggle */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayout("horizontal")}
              className={cn(
                "h-7 px-2.5 gap-1.5 text-xs",
                layout === "horizontal" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Columns className="w-3.5 h-3.5" />
              Top
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayout("vertical")}
              className={cn(
                "h-7 px-2.5 gap-1.5 text-xs",
                layout === "vertical" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Left
            </Button>
          </div>
        </div>

        {/* Pipeline Board */}
        {layout === "horizontal" ? (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {STAGES.map((stage) => (
                <StageColumn
                  key={stage}
                  stage={stage}
                  jobs={jobsByStage(stage)}
                  isExpanded={expandedStage === stage}
                  onToggle={() => handleToggle(stage)}
                  layout="horizontal"
                />
              ))}
            </div>
            {expandedStage && (
              <ExpandedStagePanel
                key={expandedStage}
                stage={expandedStage}
                jobs={jobsByStage(expandedStage)}
                onClose={() => setExpandedStage(null)}
              />
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            {/* Vertical pipeline on left */}
            <div className="flex flex-col gap-2 w-[240px] shrink-0 overflow-y-auto max-h-[calc(100vh-140px)]">
              {STAGES.map((stage) => (
                <StageColumn
                  key={stage}
                  stage={stage}
                  jobs={jobsByStage(stage)}
                  isExpanded={expandedStage === stage}
                  onToggle={() => handleToggle(stage)}
                  layout="vertical"
                />
              ))}
            </div>
            {/* Expanded panel on right */}
            <div className="flex-1 min-w-0">
              {expandedStage ? (
                <ExpandedStagePanel
                  key={expandedStage}
                  stage={expandedStage}
                  jobs={jobsByStage(expandedStage)}
                  onClose={() => setExpandedStage(null)}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  Click a stage to view jobs
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
