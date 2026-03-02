import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, DollarSign, Receipt, Send, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Package, Camera, AlertTriangle, Mail, MessageSquare, Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { JobDetail } from "@/data/dummyJobDetails";
import { toast } from "@/hooks/use-toast";

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

// Generate mock quoted vs actual data from a job
function getReconciliation(job: JobDetail) {
  const quotedLabour = job.labourTotal || 850;
  const actualLabour = quotedLabour * (0.85 + Math.random() * 0.35); // 85-120% of quoted
  const materialsTotal = job.materials.reduce((s, m) => s + m.quantity * m.unitPrice, 0);
  const quotedMaterials = materialsTotal || 620;
  const actualMaterials = quotedMaterials * (0.9 + Math.random() * 0.25);
  const quotedExtras = job.extrasTotal || 150;
  const actualExtras = quotedExtras * (0.8 + Math.random() * 0.4);

  return {
    labour: { quoted: quotedLabour, actual: Math.round(actualLabour * 100) / 100 },
    materials: { quoted: quotedMaterials, actual: Math.round(actualMaterials * 100) / 100 },
    extras: { quoted: quotedExtras, actual: Math.round(actualExtras * 100) / 100 },
  };
}

export function JobCloseOutFlow({ open, onOpenChange, job }: JobCloseOutFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [sendMethod, setSendMethod] = useState<"email" | "sms" | "both">("email");
  const [invoiceNote, setInvoiceNote] = useState("");
  const [reconciliation] = useState(() => getReconciliation(job));

  const currentStep = STEPS[step];
  const canNext = step < STEPS.length - 1;
  const canPrev = step > 0;

  const quotedTotal = reconciliation.labour.quoted + reconciliation.materials.quoted + reconciliation.extras.quoted;
  const actualTotal = reconciliation.labour.actual + reconciliation.materials.actual + reconciliation.extras.actual;
  const margin = quotedTotal > 0 ? ((quotedTotal - actualTotal) / quotedTotal) * 100 : 0;
  const gst = quotedTotal * 0.15;
  const invoiceTotal = quotedTotal + gst;

  const StepIcon = currentStep?.icon || FileText;

  function handleComplete() {
    toast({
      title: "Invoice Sent ✅",
      description: `$${invoiceTotal.toFixed(2)} invoice sent to ${job.client}. Job moved to Invoiced.`,
      duration: 4000,
    });
    onOpenChange(false);
  }

  function CostRow({ label, quoted, actual }: { label: string; quoted: number; actual: number }) {
    const diff = actual - quoted;
    const over = diff > 0;
    return (
      <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
        <span className="text-sm font-medium text-card-foreground">{label}</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground w-20 text-right">${quoted.toFixed(0)}</span>
          <span className={cn("w-20 text-right font-semibold", over ? "text-[hsl(var(--status-red))]" : "text-[hsl(var(--status-green))]")}>
            ${actual.toFixed(0)}
          </span>
          <span className={cn("w-16 text-right text-xs font-medium", over ? "text-[hsl(var(--status-orange))]" : "text-[hsl(var(--status-green))]")}>
            {over ? "+" : ""}{diff > 0 ? "+" : ""}${Math.abs(diff).toFixed(0)}
          </span>
        </div>
      </div>
    );
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
              onClick={() => i <= step && setStep(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>

        <div className="space-y-4 min-h-[200px]">

          {/* Step 1: Review Job Sheet */}
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

              {/* Staff involved */}
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
            </div>
          )}

          {/* Step 2: Reconcile Costs */}
          {currentStep?.id === "reconcile" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                <span>Category</span>
                <div className="flex gap-4">
                  <span className="w-20 text-right">Quoted</span>
                  <span className="w-20 text-right">Actual</span>
                  <span className="w-16 text-right">Diff</span>
                </div>
              </div>

              <Card>
                <CardContent className="pt-3 pb-1">
                  <CostRow label="Labour" quoted={reconciliation.labour.quoted} actual={reconciliation.labour.actual} />
                  <CostRow label="Materials" quoted={reconciliation.materials.quoted} actual={reconciliation.materials.actual} />
                  <CostRow label="Extras" quoted={reconciliation.extras.quoted} actual={reconciliation.extras.actual} />
                </CardContent>
              </Card>

              {/* Totals */}
              <Card className={cn(
                "border-2",
                margin < 0 ? "border-[hsl(var(--status-red)/0.4)]" : margin < 10 ? "border-[hsl(var(--status-orange)/0.4)]" : "border-[hsl(var(--status-green)/0.4)]"
              )}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-card-foreground">Total</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground w-20 text-right font-semibold">${quotedTotal.toFixed(0)}</span>
                      <span className="w-20 text-right font-bold text-card-foreground">${actualTotal.toFixed(0)}</span>
                      <span className={cn("w-16 text-right text-xs font-bold", margin < 0 ? "text-[hsl(var(--status-red))]" : "text-[hsl(var(--status-green))]")}>
                        {margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {margin < 0 && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[hsl(var(--status-red))]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Over budget — review costs before invoicing
                    </div>
                  )}
                  {margin >= 0 && margin < 10 && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[hsl(var(--status-orange))]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Thin margin — consider adjusting
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Generate Invoice */}
          {currentStep?.id === "invoice" && (
            <div className="space-y-3">
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Client</span>
                    <span className="font-semibold text-card-foreground">{job.client}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Job</span>
                    <span className="font-medium text-card-foreground">{job.jobName}</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Labour</span>
                    <span className="text-card-foreground">${reconciliation.labour.quoted.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Materials</span>
                    <span className="text-card-foreground">${reconciliation.materials.quoted.toFixed(2)}</span>
                  </div>
                  {reconciliation.extras.quoted > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Extras</span>
                      <span className="text-card-foreground">${reconciliation.extras.quoted.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-card-foreground">${quotedTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (15%)</span>
                    <span className="text-card-foreground">${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-1">
                    <span>Total</span>
                    <span>${invoiceTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-1.5">
                <Label>Invoice note (optional)</Label>
                <Textarea
                  className="bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  value={invoiceNote}
                  onChange={(e) => setInvoiceNote(e.target.value)}
                  placeholder="e.g. Payment due within 14 days..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 4: Send */}
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
            </div>
          )}

          {/* Step 5: Done */}
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
                  // In a real app, navigate to next "To Invoice" job
                  toast({ title: "Close & Next", description: "Jumping to next job to invoice…", duration: 2000 });
                }}>
                  <ChevronRight className="w-4 h-4" />
                  Close & Next Job
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation — hide on Done step */}
        {currentStep?.id !== "done" && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
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
              onClick={() => setStep((s) => s + 1)}
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
