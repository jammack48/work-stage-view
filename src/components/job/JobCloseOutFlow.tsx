import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, DollarSign, Receipt, Send, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Package, Camera, AlertTriangle, Mail, MessageSquare, Plus, Trash2,
  Check, ExternalLink, Eye, EyeOff
} from "lucide-react";
import { ServiceReminderSection } from "@/components/job/ServiceReminderSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { JobDetail } from "@/data/dummyJobDetails";
import { toast } from "@/hooks/use-toast";
import { useDemoData } from "@/contexts/DemoDataContext";
import { stageForPipelineEvent } from "@/services/pipelineTransitions";

interface JobCloseOutFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail;
}

const STEPS = [
  { id: "review", label: "Review Job Sheet", icon: FileText },
  { id: "reconcile", label: "Reconcile Costs", icon: DollarSign },
  { id: "invoice", label: "Generate Invoice", icon: Receipt },
  { id: "send", label: "Send", icon: Send },
  { id: "done", label: "Done", icon: CheckCircle2 },
];

interface CostLine {
  id: string;
  section: "labour" | "materials" | "extras";
  description: string;
  quotedQty: number;
  quotedRate: number;
  actualQty: number;
  actualRate: number;
  supplierMatched: boolean;
  supplier?: string;
}

interface InvoiceLine {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  visible: boolean;
}

function buildCostLines(job: JobDetail): CostLine[] {
  const lines: CostLine[] = [];

  // Labour lines from staff time entries
  const staffHours: Record<string, { hours: number; desc: string }> = {};
  job.timeEntries.forEach((t) => {
    if (!staffHours[t.staff]) staffHours[t.staff] = { hours: 0, desc: t.description };
    staffHours[t.staff].hours += t.hours;
  });
  const staffNames = Object.keys(staffHours);
  if (staffNames.length === 0) {
    lines.push({
      id: "l-default", section: "labour", description: "Labour", quotedQty: 10, quotedRate: 85,
      actualQty: 10, actualRate: 85, supplierMatched: true,
    });
  } else {
    staffNames.forEach((name, i) => {
      const hrs = staffHours[name].hours;
      lines.push({
        id: `l-${i}`, section: "labour", description: `${name}`, quotedQty: hrs, quotedRate: 85,
        actualQty: hrs + (i === 0 ? 1.5 : 0), actualRate: 85, supplierMatched: true,
      });
    });
  }

  // Material lines
  job.materials.forEach((m, i) => {
    lines.push({
      id: `m-${i}`, section: "materials", description: m.name, quotedQty: m.quantity, quotedRate: m.unitPrice,
      actualQty: m.quantity, actualRate: m.unitPrice * (0.9 + Math.random() * 0.2),
      supplierMatched: m.supplierDoc?.matched ?? (i % 3 !== 2), supplier: m.supplier,
    });
  });

  // Extras
  if (job.extrasTotal > 0) {
    lines.push({
      id: "e-0", section: "extras", description: "Travel / Mileage", quotedQty: 1, quotedRate: 65,
      actualQty: 1, actualRate: 65, supplierMatched: true,
    });
    lines.push({
      id: "e-1", section: "extras", description: "Waste Disposal", quotedQty: 1, quotedRate: job.extrasTotal - 65,
      actualQty: 1, actualRate: job.extrasTotal - 65, supplierMatched: true,
    });
  }

  return lines;
}

function buildInvoiceLines(costLines: CostLine[]): InvoiceLine[] {
  return costLines.map((c) => ({
    id: c.id,
    description: c.description,
    qty: c.quotedQty,
    unitPrice: c.quotedRate,
    visible: true,
  }));
}

export function JobCloseOutFlow({ open, onOpenChange, job }: JobCloseOutFlowProps) {
  const navigate = useNavigate();
  const { updateJobStage } = useDemoData();
  const [step, setStep] = useState(0);
  const [sendMethod, setSendMethod] = useState<"email" | "sms" | "both">("email");
  const [invoiceNote, setInvoiceNote] = useState("");

  // Step 1 checklist
  const [checks, setChecks] = useState({ time: false, photos: false, notes: false });
  const allChecked = checks.time && checks.photos && checks.notes;

  // Step 2 editable cost lines
  const [costLines, setCostLines] = useState<CostLine[]>(() => buildCostLines(job));

  // Step 3 editable invoice lines
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>(() => buildInvoiceLines(buildCostLines(job)));

  // Collapsible sections for step 1
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [photosOpen, setPhotosOpen] = useState(false);

  const currentStep = STEPS[step];
  const canPrev = step > 0;

  // Step 1 blocks next unless all verified
  const canNext = step === 0 ? allChecked && step < STEPS.length - 1 : step < STEPS.length - 1;

  // Reconciliation totals
  const quotedTotal = costLines.reduce((s, c) => s + c.quotedQty * c.quotedRate, 0);
  const actualTotal = costLines.reduce((s, c) => s + c.actualQty * c.actualRate, 0);
  const margin = quotedTotal > 0 ? ((quotedTotal - actualTotal) / quotedTotal) * 100 : 0;
  const unmatchedCount = costLines.filter((c) => c.section === "materials" && !c.supplierMatched).length;

  // Invoice totals
  const invoiceSubtotal = invoiceLines.filter((l) => l.visible).reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const gst = invoiceSubtotal * 0.15;
  const invoiceTotal = invoiceSubtotal + gst;

  const StepIcon = currentStep?.icon || FileText;

  function updateCostLine(id: string, patch: Partial<CostLine>) {
    setCostLines((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addCostLine() {
    const newId = `e-new-${Date.now()}`;
    setCostLines((prev) => [...prev, {
      id: newId, section: "extras", description: "New cost", quotedQty: 0, quotedRate: 0,
      actualQty: 1, actualRate: 0, supplierMatched: false,
    }]);
  }

  function updateInvoiceLine(id: string, patch: Partial<InvoiceLine>) {
    setInvoiceLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addInvoiceLine() {
    const newId = `inv-new-${Date.now()}`;
    setInvoiceLines((prev) => [...prev, { id: newId, description: "New item", qty: 1, unitPrice: 0, visible: true }]);
  }

  function removeInvoiceLine(id: string) {
    setInvoiceLines((prev) => prev.filter((l) => l.id !== id));
  }

  function handleComplete() {
    toast({
      title: "Invoice Sent ✅",
      description: `$${invoiceTotal.toFixed(2)} invoice sent to ${job.client}. Job moved to Invoiced.`,
      duration: 4000,
    });
    updateJobStage(job.id, stageForPipelineEvent("invoice_sent"));
    onOpenChange(false);
  }

  // Sync cost lines → invoice lines when moving to step 3
  function goToStep(next: number) {
    if (next === 2) {
      // rebuild invoice lines from cost lines
      setInvoiceLines(buildInvoiceLines(costLines));
    }
    setStep(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StepIcon className="w-5 h-5 text-primary" />
            {currentStep?.label}
          </DialogTitle>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pb-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i <= step && goToStep(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>

        <div className="space-y-4 min-h-[200px]">

          {/* ========== Step 1: Review Job Sheet ========== */}
          {currentStep?.id === "review" && (
            <div className="space-y-3">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-card-foreground">{job.jobName}</span>
                    <Badge variant="outline">{job.stage}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {job.timeEntries.reduce((s, t) => s + t.hours, 0)} hrs logged
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Camera className="w-3.5 h-3.5" />
                      {job.photos.length} photos
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="w-3.5 h-3.5" />
                      {job.materials.length} materials
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="w-3.5 h-3.5" />
                      {job.notes.length} notes
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crew */}
              {job.staff.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Crew</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {job.staff.map((s) => (
                      <Badge key={s.name} variant="secondary" className="text-xs">
                        {s.avatar} {s.name} · {s.role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Time entries */}
              {job.timeEntries.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Time Log</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {job.timeEntries.map((t) => (
                      <div key={t.id} className="flex justify-between text-xs text-muted-foreground py-1 border-b border-border/30">
                        <span>{t.date} — {t.staff}</span>
                        <span className="font-medium text-card-foreground">{t.hours}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Materials */}
              <Collapsible open={materialsOpen} onOpenChange={setMaterialsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-xs text-muted-foreground uppercase tracking-wider py-1.5 hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Materials Used ({job.materials.length})</span>
                  <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", materialsOpen && "rotate-90")} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-1 max-h-40 overflow-y-auto mt-1">
                    {job.materials.map((m) => (
                      <div key={m.id} className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
                        <div>
                          <span className="text-card-foreground font-medium">{m.name}</span>
                          {m.supplier && <span className="text-muted-foreground ml-1.5">({m.supplier})</span>}
                        </div>
                        <span className="text-muted-foreground">{m.quantity} {m.unit} × ${m.unitPrice}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Expandable Photos */}
              <Collapsible open={photosOpen} onOpenChange={setPhotosOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-xs text-muted-foreground uppercase tracking-wider py-1.5 hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Photos ({job.photos.length})</span>
                  <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", photosOpen && "rotate-90")} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {job.photos.map((p) => (
                      <div key={p.id} className="aspect-square rounded-md flex items-center justify-center text-[10px] text-white/80 font-medium" style={{ backgroundColor: p.color }}>
                        {p.caption}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Verification Checklist */}
              <div className="space-y-2 pt-2 border-t border-border">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Verification Checklist</Label>
                {[
                  { key: "time" as const, label: "Time entries verified" },
                  { key: "photos" as const, label: "Photos complete" },
                  { key: "notes" as const, label: "Notes reviewed" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2.5 cursor-pointer py-1">
                    <Checkbox
                      checked={checks[item.key]}
                      onCheckedChange={(v) => setChecks((prev) => ({ ...prev, [item.key]: !!v }))}
                    />
                    <span className={cn("text-sm", checks[item.key] ? "text-card-foreground" : "text-muted-foreground")}>
                      {item.label}
                    </span>
                    {checks[item.key] && <Check className="w-3.5 h-3.5 text-[hsl(var(--status-green))] ml-auto" />}
                  </label>
                ))}
                {!allChecked && (
                  <p className="text-xs text-[hsl(var(--status-orange))] flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> Tick all items to proceed
                  </p>
                )}
              </div>

              {/* Open Job Card link */}
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => navigate(`/job/${job.id}`)}>
                <ExternalLink className="w-3.5 h-3.5" /> Open Job Card
              </Button>
            </div>
          )}

          {/* ========== Step 2: Reconcile Costs ========== */}
          {currentStep?.id === "reconcile" && (
            <div className="space-y-3">
              {unmatchedCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--status-orange))] bg-[hsl(var(--status-orange)/0.1)] rounded-md px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {unmatchedCount} material{unmatchedCount > 1 ? "s" : ""} without supplier doc match
                </div>
              )}

              {/* Labour section */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Labour</Label>
                {costLines.filter((c) => c.section === "labour").map((line) => (
                  <div key={line.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 text-sm">
                    <span className="flex-1 text-card-foreground truncate">{line.description}</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={line.actualQty}
                        onChange={(e) => updateCostLine(line.id, { actualQty: parseFloat(e.target.value) || 0 })}
                        className="w-16 h-7 text-xs text-center"
                      />
                      <span className="text-xs text-muted-foreground">hrs ×</span>
                      <Input
                        type="number"
                        value={line.actualRate}
                        onChange={(e) => updateCostLine(line.id, { actualRate: parseFloat(e.target.value) || 0 })}
                        className="w-16 h-7 text-xs text-center"
                      />
                    </div>
                    <span className="w-16 text-right text-xs font-semibold text-card-foreground">
                      ${(line.actualQty * line.actualRate).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Materials section */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Materials</Label>
                {costLines.filter((c) => c.section === "materials").map((line) => {
                  const diff = (line.actualQty * line.actualRate) - (line.quotedQty * line.quotedRate);
                  const over = diff > 1;
                  return (
                    <div key={line.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 text-sm">
                      <button
                        onClick={() => updateCostLine(line.id, { supplierMatched: !line.supplierMatched })}
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors",
                          line.supplierMatched
                            ? "bg-[hsl(var(--status-green)/0.15)] border-[hsl(var(--status-green)/0.4)] text-[hsl(var(--status-green))]"
                            : "bg-[hsl(var(--status-orange)/0.1)] border-[hsl(var(--status-orange)/0.4)] text-[hsl(var(--status-orange))]"
                        )}
                        title={line.supplierMatched ? "Receipt matched" : "Unmatched — click to match"}
                      >
                        {line.supplierMatched ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className="text-card-foreground text-xs truncate block">{line.description}</span>
                        {line.supplier && <span className="text-[10px] text-muted-foreground">{line.supplier}</span>}
                      </div>
                      <Input
                        type="number"
                        value={line.actualQty}
                        onChange={(e) => updateCostLine(line.id, { actualQty: parseFloat(e.target.value) || 0 })}
                        className="w-12 h-7 text-xs text-center"
                      />
                      <span className="text-[10px] text-muted-foreground">×</span>
                      <Input
                        type="number"
                        value={Math.round(line.actualRate * 100) / 100}
                        onChange={(e) => updateCostLine(line.id, { actualRate: parseFloat(e.target.value) || 0 })}
                        className="w-16 h-7 text-xs text-center"
                      />
                      <span className={cn("w-14 text-right text-xs font-semibold", over ? "text-[hsl(var(--status-orange))]" : "text-card-foreground")}>
                        ${(line.actualQty * line.actualRate).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Extras section */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Extras</Label>
                {costLines.filter((c) => c.section === "extras").map((line) => (
                  <div key={line.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 text-sm">
                    <Input
                      value={line.description}
                      onChange={(e) => updateCostLine(line.id, { description: e.target.value })}
                      className="flex-1 h-7 text-xs"
                    />
                    <Input
                      type="number"
                      value={line.actualQty}
                      onChange={(e) => updateCostLine(line.id, { actualQty: parseFloat(e.target.value) || 0 })}
                      className="w-12 h-7 text-xs text-center"
                    />
                    <span className="text-[10px] text-muted-foreground">×</span>
                    <Input
                      type="number"
                      value={line.actualRate}
                      onChange={(e) => updateCostLine(line.id, { actualRate: parseFloat(e.target.value) || 0 })}
                      className="w-16 h-7 text-xs text-center"
                    />
                    <span className="w-14 text-right text-xs font-semibold text-card-foreground">
                      ${(line.actualQty * line.actualRate).toFixed(0)}
                    </span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="gap-1 text-xs mt-1" onClick={addCostLine}>
                  <Plus className="w-3.5 h-3.5" /> Add Cost
                </Button>
              </div>

              {/* Totals card */}
              <Card className={cn(
                "border-2",
                margin < 0 ? "border-[hsl(var(--status-red)/0.4)]" : margin < 10 ? "border-[hsl(var(--status-orange)/0.4)]" : "border-[hsl(var(--status-green)/0.4)]"
              )}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-card-foreground">Quoted</span>
                    <span className="text-muted-foreground font-semibold">${quotedTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-card-foreground">Actual</span>
                    <span className="font-bold text-card-foreground">${actualTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-1 border-t border-border/50 mt-1">
                    <span className="font-bold">Margin</span>
                    <span className={cn("font-bold", margin < 0 ? "text-[hsl(var(--status-red))]" : margin < 10 ? "text-[hsl(var(--status-orange))]" : "text-[hsl(var(--status-green))]")}>
                      {margin.toFixed(1)}%
                    </span>
                  </div>
                  {margin < 0 && (
                    <p className="text-xs text-[hsl(var(--status-red))] flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3 h-3" /> Over budget — review before invoicing
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ========== Step 3: Generate Invoice ========== */}
          {currentStep?.id === "invoice" && (
            <div className="space-y-3">
              <Card>
                <CardContent className="pt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Client</span>
                    <span className="font-semibold text-card-foreground">{job.client}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Job</span>
                    <span className="font-medium text-card-foreground">{job.jobName}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Editable line items */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider px-1">
                  <span className="w-5" />
                  <span className="flex-1">Description</span>
                  <span className="w-12 text-center">Qty</span>
                  <span className="w-16 text-center">Price</span>
                  <span className="w-14 text-right">Total</span>
                  <span className="w-6" />
                </div>
                {invoiceLines.map((line) => (
                  <div key={line.id} className={cn("flex items-center gap-2 py-1 border-b border-border/30", !line.visible && "opacity-40")}>
                    <button onClick={() => updateInvoiceLine(line.id, { visible: !line.visible })} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground">
                      {line.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <Input
                      value={line.description}
                      onChange={(e) => updateInvoiceLine(line.id, { description: e.target.value })}
                      className="flex-1 h-7 text-xs"
                    />
                    <Input
                      type="number"
                      value={line.qty}
                      onChange={(e) => updateInvoiceLine(line.id, { qty: parseFloat(e.target.value) || 0 })}
                      className="w-12 h-7 text-xs text-center"
                    />
                    <Input
                      type="number"
                      value={Math.round(line.unitPrice * 100) / 100}
                      onChange={(e) => updateInvoiceLine(line.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-16 h-7 text-xs text-center"
                    />
                    <span className="w-14 text-right text-xs font-semibold text-card-foreground">
                      ${(line.qty * line.unitPrice).toFixed(0)}
                    </span>
                    <button onClick={() => removeInvoiceLine(line.id)} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="gap-1 text-xs mt-1" onClick={addInvoiceLine}>
                  <Plus className="w-3.5 h-3.5" /> Add Line Item
                </Button>
              </div>

              {/* Totals */}
              <Card>
                <CardContent className="pt-3 pb-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-card-foreground">${invoiceSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (15%)</span>
                    <span className="text-card-foreground">${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-1 border-t border-border">
                    <span>Total</span>
                    <span>${invoiceTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-1.5">
                <Label>Invoice note (optional)</Label>
                <Textarea
                  value={invoiceNote}
                  onChange={(e) => setInvoiceNote(e.target.value)}
                  placeholder="e.g. Payment due within 14 days..."
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* ========== Step 4: Send ========== */}
          {currentStep?.id === "send" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-semibold text-card-foreground">{job.client}</span>
                  </div>
                  {job.clientEmail && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-card-foreground">{job.clientEmail}</span>
                    </div>
                  )}
                  {job.clientPhone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="text-card-foreground">{job.clientPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold">
                    <span>Invoice Total</span>
                    <span>${invoiceTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Delivery Method</Label>
                <div className="flex gap-2">
                  {([
                    { id: "email" as const, label: "Email", icon: Mail },
                    { id: "sms" as const, label: "SMS", icon: MessageSquare },
                    { id: "both" as const, label: "Both", icon: Send },
                  ]).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSendMethod(m.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
                        sendMethod === m.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-accent"
                      )}
                    >
                      <m.icon className="w-4 h-4" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <ServiceReminderSection customerName={job.client} jobName={job.jobName} />
            </div>
          )}

          {/* ========== Step 5: Done ========== */}
          {currentStep?.id === "done" && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--status-green)/0.15)] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[hsl(var(--status-green))]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-card-foreground">Invoice Ready to Send</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  ${invoiceTotal.toFixed(2)} to {job.client} via {sendMethod === "both" ? "email & SMS" : sendMethod}
                </p>
              </div>

              <Card>
                <CardContent className="pt-3 pb-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">Quoted</span>
                      <div className="font-semibold">${quotedTotal.toFixed(0)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Actual Cost</span>
                      <div className="font-semibold">${actualTotal.toFixed(0)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Margin</span>
                      <div className={cn("font-bold", margin < 0 ? "text-[hsl(var(--status-red))]" : "text-[hsl(var(--status-green))]")}>
                        {margin.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Delivery</span>
                      <div className="font-semibold capitalize">{sendMethod === "both" ? "Email + SMS" : sendMethod}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2 pt-2">
                <Button size="lg" className="w-full h-12 gap-2" onClick={handleComplete}>
                  <Send className="w-5 h-5" />
                  Send Invoice & Close Out
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                  handleComplete();
                  toast({ title: "Close & Next", description: "Jumping to next job to invoice…", duration: 2000 });
                }}>
                  <ChevronRight className="w-4 h-4" />
                  Close & Next Job
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep?.id !== "done" && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep(step - 1)}
              disabled={!canPrev}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <span className="text-xs text-muted-foreground">
              {step + 1} of {STEPS.length}
            </span>
            <Button
              size="sm"
              onClick={() => goToStep(step + 1)}
              disabled={!canNext}
              className="gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
