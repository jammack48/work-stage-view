import { useState } from "react";
import { STAGES, jobsByStage, type Stage } from "@/data/dummyJobs";
import { StageColumn } from "@/components/StageColumn";
import { ExpandedStagePanel } from "@/components/ExpandedStagePanel";
import { Zap, ChevronRight } from "lucide-react";

const Index = () => {
  const [expandedStage, setExpandedStage] = useState<Stage | null>(null);

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
      </header>

      <main className="p-4 lg:p-6 space-y-4">
        {/* Pipeline heading with flow arrows */}
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

        {/* Pipeline Board — stacked cards */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              jobs={jobsByStage(stage)}
              isExpanded={expandedStage === stage}
              onToggle={() => handleToggle(stage)}
            />
          ))}
        </div>

        {/* Expanded Detail Panel — row-based */}
        {expandedStage && (
          <ExpandedStagePanel
            key={expandedStage}
            stage={expandedStage}
            jobs={jobsByStage(expandedStage)}
            onClose={() => setExpandedStage(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
