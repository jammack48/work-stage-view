import { useState } from "react";
import { STAGES, jobsByStage, type Stage } from "@/data/dummyJobs";
import { StageColumn } from "@/components/StageColumn";
import { ExpandedStagePanel } from "@/components/ExpandedStagePanel";
import { Zap } from "lucide-react";

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
        <span className="text-xs text-muted-foreground">Pipeline Dashboard</span>
      </header>

      {/* Pipeline Board */}
      <main className="p-4 lg:p-6 space-y-4">
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

        {/* Expanded Detail Panel */}
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
