import { useState, useEffect, useCallback } from "react";
import { STAGES, jobsByStage, type Stage } from "@/data/dummyJobs";
import { StageColumn } from "@/components/StageColumn";
import { ExpandedStagePanel } from "@/components/ExpandedStagePanel";
import { PipelineFlowBanner } from "@/components/PipelineFlowBanner";
import { Zap, ChevronRight, LayoutGrid, Columns, Sun, Moon, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import useEmblaCarousel from "embla-carousel-react";


type Layout = "horizontal" | "vertical";

const ACTION_BOXES: Record<string, string> = {
  "Lead": "Add Customer",
  "Quote Sent": "New Quote",
  "In Progress": "New Job",
  "To Invoice": "New Invoice",
};

const Index = () => {
  const [expandedStage, setExpandedStage] = useState<Stage | null>(null);
  const [layout, setLayout] = useState<Layout>("horizontal");
  const [isDark, setIsDark] = useState(true);
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center" });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const handleToggle = (stage: Stage) => {
    setExpandedStage((prev) => (prev === stage ? null : stage));
  };

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="px-4 sm:px-6 py-3 border-b border-border bg-card flex items-center justify-between">
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

      <main className="p-3 sm:p-4 lg:p-6 space-y-4">
        {/* Pipeline heading with flow arrows + layout toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium flex-wrap">
            <span className="text-card-foreground font-bold text-base">Pipeline Dashboard</span>
            <div className="flex items-center gap-0.5 opacity-50">
              <span className="text-xs">Lead</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <ChevronRight className="w-3.5 h-3.5 -ml-2" />
              <ChevronRight className="w-3.5 h-3.5 -ml-2" />
              <span className="text-xs">Paid</span>
            </div>
          </div>

          {/* Layout toggle — hide on mobile */}
          {!isMobile && (
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
          )}
        </div>

        {/* Mobile: swipeable single-bucket carousel */}
        {isMobile ? (
          <div className="space-y-3">
            {/* Slide indicator + nav */}
            <div className="flex items-center justify-between px-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={scrollPrev} disabled={currentSlide === 0}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex gap-1.5">
                {STAGES.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === currentSlide ? "bg-primary scale-125" : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={scrollNext} disabled={currentSlide === STAGES.length - 1}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Embla carousel */}
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex">
                {STAGES.map((stage) => (
                  <div key={stage} className="flex-[0_0_85%] max-w-[320px] min-w-0 px-2">
                    <StageColumn
                      stage={stage}
                      jobs={jobsByStage(stage)}
                      isExpanded={expandedStage === stage}
                      onToggle={() => handleToggle(stage)}
                      onNext={scrollNext}
                      layout="horizontal"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded panel below */}
            {expandedStage && (
              <ExpandedStagePanel
                key={expandedStage}
                stage={expandedStage}
                jobs={jobsByStage(expandedStage)}
                onClose={() => setExpandedStage(null)}
              />
            )}
          </div>
        ) : layout === "horizontal" ? (
          <div className="space-y-0">
            <PipelineFlowBanner activeStage={expandedStage} />
            <div className="flex gap-2 overflow-x-auto pb-2 pt-2">
              {STAGES.map((stage) => (
                <div key={stage} className="min-w-[200px] w-[200px] flex-shrink-0 flex flex-col gap-2">
                  <StageColumn
                    stage={stage}
                    jobs={jobsByStage(stage)}
                    isExpanded={expandedStage === stage}
                    onToggle={() => handleToggle(stage)}
                    layout="horizontal"
                  />
                  {ACTION_BOXES[stage] && (
                    <button
                      className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-muted-foreground/30 py-4 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => {}}
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-xs font-medium">{ACTION_BOXES[stage]}</span>
                    </button>
                  )}
                </div>
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
