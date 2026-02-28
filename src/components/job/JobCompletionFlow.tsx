import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Camera, Clock, Package, FileText, Shield, RotateCcw, Upload, FileImage, Truck, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JobDetail, MaterialItem } from "@/data/dummyJobDetails";
import { toast } from "@/hooks/use-toast";

interface JobCompletionFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail;
}

const STEPS = [
  { id: "return", label: "Coming Back?", icon: RotateCcw },
  { id: "jobsheet", label: "Job Sheet", icon: FileText },
  { id: "time", label: "Time", icon: Clock },
  { id: "parts", label: "Parts Used", icon: Package },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "compliance", label: "Compliance", icon: Shield },
];

interface PartUsed extends MaterialItem {
  used: boolean;
  source: "van-stock" | "supplier";
  supplierName?: string;
  receiptPhoto?: boolean;
}

export function JobCompletionFlow({ open, onOpenChange, job }: JobCompletionFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Return visit
  const [returnNeeded, setReturnNeeded] = useState(false);
  const [returnNote, setReturnNote] = useState("");

  // Job sheet
  const [jobSheet, setJobSheet] = useState(job.description || `Completed ${job.jobName} at ${job.address}.`);

  // Time
  const budgetedHours = job.timeEntries.reduce((s, t) => s + t.hours, 0);
  const [actualHours, setActualHours] = useState(budgetedHours.toString());

  // Parts
  const [parts, setParts] = useState<PartUsed[]>(() =>
    job.materials.map((m) => ({ ...m, used: true, source: "van-stock" as const }))
  );
  const [extraPart, setExtraPart] = useState("");

  // Photos
  const [photoCount, setPhotoCount] = useState(0);

  // Compliance
  const [complianceRequired, setComplianceRequired] = useState(false);
  const [cocNumber, setCocNumber] = useState("");

  const canNext = step < STEPS.length - 1;
  const canPrev = step > 0;

  const vanStockUsed = parts.filter((p) => p.used && p.source === "van-stock");
  const supplierItems = parts.filter((p) => p.used && p.source === "supplier");

  function handleAddExtra() {
    if (!extraPart.trim()) return;
    setParts((prev) => [...prev, {
      id: `extra-${Date.now()}`,
      name: extraPart.trim(),
      quantity: 1,
      unit: "pcs",
      unitPrice: 0,
      supplier: "",
      used: true,
      source: "supplier",
    }]);
    setExtraPart("");
  }

  function handleSubmit() {
    const poItems = vanStockUsed;
    
    toast({
      title: returnNeeded ? "Return Visit Flagged" : "Job Completed ✅",
      description: returnNeeded
        ? `${job.jobName} marked as needing a return visit.`
        : `${job.jobName} marked as complete.${poItems.length > 0 ? ` PO generated for ${poItems.length} van stock items.` : ""}`,
    });

    if (poItems.length > 0) {
      setTimeout(() => {
        toast({
          title: "📋 Purchase Order Generated",
          description: `Restock PO created for ${poItems.length} items used from van stock.`,
        });
      }, 1500);
    }

    onOpenChange(false);
    navigate("/");
  }

  const StepIcon = STEPS[step].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StepIcon className="w-5 h-5 text-primary" />
            {STEPS[step].label}
          </DialogTitle>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pb-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="space-y-4 min-h-[200px]">
          {/* Step 0: Return visit */}
          {step === 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Do you need to come back?</Label>
                <Switch checked={returnNeeded} onCheckedChange={setReturnNeeded} />
              </div>
              {returnNeeded && (
                <div className="space-y-2">
                  <Label>What's needed?</Label>
                  <Textarea
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    placeholder="e.g. Waiting on parts, need to finish wiring..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 1: Job sheet */}
          {step === 1 && (
            <div className="space-y-2">
              <Label>What was done on this job?</Label>
              <Textarea
                value={jobSheet}
                onChange={(e) => setJobSheet(e.target.value)}
                rows={6}
                placeholder="Describe the work completed..."
              />
            </div>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budgeted</span>
                <span className="font-semibold">{budgetedHours} hrs</span>
              </div>
              <div className="space-y-1.5">
                <Label>Actual hours</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                />
              </div>
              {Number(actualHours) > budgetedHours && (
                <p className="text-xs text-[hsl(var(--status-orange))]">
                  ⚠ {(Number(actualHours) - budgetedHours).toFixed(1)} hrs over budget
                </p>
              )}
            </div>
          )}

          {/* Step 3: Parts — van stock vs supplier */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Quoted items pre-selected. Mark source: <strong>Van Stock</strong> (auto-generates restock PO) or <strong>Supplier</strong> (photo receipt).
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {parts.map((p, i) => (
                  <div key={p.id} className={cn(
                    "p-2.5 rounded-lg border transition-colors space-y-2",
                    p.used ? "bg-accent/20 border-border" : "bg-muted/20 border-transparent opacity-50"
                  )}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={p.used}
                        onCheckedChange={(checked) =>
                          setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, used: !!checked } : pp))
                        }
                      />
                      <span className={cn("text-sm flex-1 font-medium", !p.used && "line-through text-muted-foreground")}>{p.name}</span>
                      <Input
                        type="number"
                        className="w-16 h-7 text-xs text-right"
                        value={p.quantity}
                        disabled={!p.used}
                        onChange={(e) =>
                          setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, quantity: Number(e.target.value) || 0 } : pp))
                        }
                      />
                      <span className="text-xs text-muted-foreground w-8">{p.unit}</span>
                    </div>
                    {p.used && (
                      <div className="flex items-center gap-1.5 pl-6">
                        <button
                          onClick={() =>
                            setParts((prev) =>
                              prev.map((pp, ii) => ii === i ? { ...pp, source: "van-stock" } : pp)
                            )
                          }
                          className={cn(
                            "flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors",
                            p.source === "van-stock"
                              ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          )}
                        >
                          <Truck className="w-3 h-3" /> Van Stock
                        </button>
                        <button
                          onClick={() =>
                            setParts((prev) =>
                              prev.map((pp, ii) => ii === i ? { ...pp, source: "supplier" } : pp)
                            )
                          }
                          className={cn(
                            "flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors",
                            p.source === "supplier"
                              ? "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))] ring-1 ring-[hsl(var(--status-orange)/0.3)]"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          )}
                        >
                          <ShoppingCart className="w-3 h-3" /> Supplier
                        </button>
                        {p.source === "supplier" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-6 px-2 text-[10px] gap-1", p.receiptPhoto && "text-primary")}
                            onClick={() =>
                              setParts((prev) =>
                                prev.map((pp, ii) => ii === i ? { ...pp, receiptPhoto: !pp.receiptPhoto } : pp)
                              )
                            }
                          >
                            <FileImage className="w-3 h-3" />
                            {p.receiptPhoto ? "Receipt ✓" : "Add Receipt"}
                          </Button>
                        )}
                      </div>
                    )}
                    {p.used && p.source === "supplier" && (
                      <Input
                        className="h-7 text-xs ml-6 w-auto"
                        placeholder="Supplier name..."
                        value={p.supplierName || ""}
                        onChange={(e) =>
                          setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, supplierName: e.target.value } : pp))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add extra item..."
                  value={extraPart}
                  onChange={(e) => setExtraPart(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddExtra()}
                />
                <Button size="sm" onClick={handleAddExtra}>Add</Button>
              </div>

              {/* Summary badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {vanStockUsed.length > 0 && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Truck className="w-3 h-3" /> {vanStockUsed.length} van stock → PO will be generated
                  </Badge>
                )}
                {supplierItems.length > 0 && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <ShoppingCart className="w-3 h-3" /> {supplierItems.length} from supplier
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <div className="space-y-3">
              <Label>Job photos</Label>
              <div className="grid grid-cols-2 gap-2">
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Before photos</p>
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => setPhotoCount((c) => c + 1)}>
                      Add Photo
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">After photos</p>
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => setPhotoCount((c) => c + 1)}>
                      Add Photo
                    </Button>
                  </CardContent>
                </Card>
              </div>
              {photoCount > 0 && (
                <p className="text-xs text-muted-foreground">{photoCount} photo(s) added</p>
              )}
            </div>
          )}

          {/* Step 5: Compliance */}
          {step === 5 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Compliance required?</Label>
                <Switch checked={complianceRequired} onCheckedChange={setComplianceRequired} />
              </div>
              {complianceRequired && (
                <div className="space-y-2">
                  <Label>COC / Certificate Number</Label>
                  <Input
                    value={cocNumber}
                    onChange={(e) => setCocNumber(e.target.value)}
                    placeholder="e.g. COC-2025-001"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Checkbox /> <span className="text-sm">Testing completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox /> <span className="text-sm">Certificate issued</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)} disabled={!canPrev}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {canNext ? (
            <Button size="sm" onClick={() => setStep((s) => s + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleSubmit} className="gap-1.5">
              <Check className="w-4 h-4" />
              {returnNeeded ? "Flag Return" : "Complete Job"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
