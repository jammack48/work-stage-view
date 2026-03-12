import { Layers, ChevronDown, ChevronRight, Package, Clock, AlertTriangle, CheckCircle2, CircleDot, CircleDashed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useJobPrefix } from "@/contexts/JobPrefixContext";
import type { JobStage, JobVariation, StageStatus, VariationStatus } from "@/data/dummyJobDetails";

interface StagesTabProps {
  stages?: JobStage[];
  jobId: string;
}

function stageStatusIcon(status: StageStatus) {
  switch (status) {
    case "Complete":
    case "Invoiced":
      return <CheckCircle2 className="w-4 h-4 text-[hsl(var(--status-green))]" />;
    case "In Progress":
      return <CircleDot className="w-4 h-4 text-[hsl(var(--status-orange))]" />;
    default:
      return <CircleDashed className="w-4 h-4 text-muted-foreground" />;
  }
}

function stageStatusBadge(status: StageStatus) {
  const colors: Record<StageStatus, string> = {
    Pending: "bg-muted text-muted-foreground",
    "In Progress": "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))]",
    Complete: "bg-[hsl(var(--status-green)/0.15)] text-[hsl(var(--status-green))]",
    Invoiced: "bg-primary/15 text-primary",
  };
  return <Badge className={`text-[10px] ${colors[status]} border-0`}>{status}</Badge>;
}

function variationStatusBadge(status: VariationStatus) {
  const colors: Record<VariationStatus, string> = {
    Pending: "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))]",
    Approved: "bg-[hsl(var(--status-green)/0.15)] text-[hsl(var(--status-green))]",
    Rejected: "bg-destructive/15 text-destructive",
  };
  return <Badge className={`text-[10px] ${colors[status]} border-0`}>{status}</Badge>;
}

function VariationCard({ variation, jobId, stageId }: { variation: JobVariation; jobId: string; stageId: string }) {
  const { prefix } = useJobPrefix();
  const displayId = `${prefix}-${jobId.replace(/^[A-Z]+-/, "")}-${stageId}${variation.id}`;

  return (
    <div className="border border-border/50 rounded-lg p-3 bg-secondary/30 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--status-orange))] shrink-0" />
          <span className="text-xs font-mono text-muted-foreground">{displayId}</span>
          <span className="text-sm font-medium truncate">{variation.description}</span>
        </div>
        {variationStatusBadge(variation.status)}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">${variation.value.toLocaleString()}</span>
        {variation.materials.length > 0 && (
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" /> {variation.materials.length} items
          </span>
        )}
        {variation.labour.length > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {variation.labour.reduce((s, l) => s + l.hours, 0)}h
          </span>
        )}
      </div>
    </div>
  );
}

function StageCard({ stage, jobId }: { stage: JobStage; jobId: string }) {
  const [open, setOpen] = useState(stage.status === "In Progress");
  const { prefix } = useJobPrefix();
  const displayId = `${prefix}-${jobId.replace(/^[A-Z]+-/, "")}-${stage.id}`;
  const totalLabourHrs = stage.labour.reduce((s, l) => s + l.hours, 0);
  const variationTotal = stage.variations.reduce((s, v) => s + v.value, 0);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger className="w-full text-left">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              {stageStatusIcon(stage.status)}
              <span className="text-xs font-mono text-muted-foreground">{displayId}</span>
              <span className="text-sm font-semibold flex-1">{stage.name}</span>
              {stageStatusBadge(stage.status)}
            </div>
            <div className="flex items-center gap-4 mt-1.5 ml-8 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">${stage.quotedValue.toLocaleString()}</span>
              {stage.materials.length > 0 && (
                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {stage.materials.length}</span>
              )}
              {totalLabourHrs > 0 && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {totalLabourHrs}h</span>
              )}
              {stage.variations.length > 0 && (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {stage.variations.length} variation{stage.variations.length > 1 ? "s" : ""}
                  {variationTotal > 0 && <span>(+${variationTotal.toLocaleString()})</span>}
                </span>
              )}
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-3">
            {/* Materials */}
            {stage.materials.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3 h-3" /> Materials
                </h4>
                <div className="space-y-0.5">
                  {stage.materials.map((m) => (
                    <div key={m.id} className="flex justify-between text-xs px-2 py-1 rounded bg-muted/40">
                      <span>{m.name} × {m.quantity}</span>
                      <span className="text-muted-foreground">${(m.quantity * m.unitPrice).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Labour */}
            {stage.labour.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Labour
                </h4>
                <div className="space-y-0.5">
                  {stage.labour.map((l) => (
                    <div key={l.id} className="flex justify-between text-xs px-2 py-1 rounded bg-muted/40">
                      <span>{l.staff} — {l.description}</span>
                      <span className="text-muted-foreground">{l.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variations */}
            {stage.variations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Variations
                </h4>
                {stage.variations.map((v) => (
                  <VariationCard key={v.id} variation={v} jobId={jobId} stageId={stage.id} />
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function StagesTab({ stages, jobId }: StagesTabProps) {
  if (!stages || stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <Layers className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">This is a service job — no stages required.</p>
        <p className="text-xs text-muted-foreground/60">Stages are used for project work with progress invoicing.</p>
      </div>
    );
  }

  const completedStages = stages.filter((s) => s.status === "Complete" || s.status === "Invoiced").length;
  const totalQuoted = stages.reduce((s, st) => s + st.quotedValue, 0);
  const totalVariations = stages.reduce((s, st) => s + st.variations.reduce((vs, v) => vs + v.value, 0), 0);

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">{completedStages}/{stages.length} stages complete</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Quoted: <span className="font-semibold text-foreground">${totalQuoted.toLocaleString()}</span></span>
              {totalVariations > 0 && (
                <span>Variations: <span className="font-semibold text-[hsl(var(--status-orange))]">+${totalVariations.toLocaleString()}</span></span>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-[hsl(var(--status-green))] transition-all"
              style={{ width: `${(completedStages / stages.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stage cards */}
      {stages.map((stage) => (
        <StageCard key={stage.id} stage={stage} jobId={jobId} />
      ))}
    </div>
  );
}
