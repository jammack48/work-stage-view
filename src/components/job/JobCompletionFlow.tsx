import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Camera, Clock, Package, FileText, Shield, RotateCcw, FileImage, Truck, ShoppingCart, ClipboardList, Mic, MicOff } from "lucide-react";
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
  { id: "jobsheet", label: "Job Sheet", icon: FileText },
  { id: "time", label: "Time", icon: Clock },
  { id: "parts", label: "Parts Used", icon: Package },
  { id: "po-review", label: "Restock PO", icon: ClipboardList },
  { id: "return", label: "Coming Back?", icon: RotateCcw },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "compliance", label: "Compliance", icon: Shield },
];

interface PartUsed extends MaterialItem {
  used: boolean;
  source: "van-stock" | "supplier";
  supplierName?: string;
  receiptPhoto?: string; // data URL of captured photo
}

interface CapturedPhoto {
  id: string;
  type: "before" | "after";
  dataUrl: string;
}

export function JobCompletionFlow({ open, onOpenChange, job }: JobCompletionFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [returnNeeded, setReturnNeeded] = useState(false);
  const [returnNote, setReturnNote] = useState("");
  const [jobSheet, setJobSheet] = useState(job.description || `Completed ${job.jobName} at ${job.address}.`);
  const budgetedHours = job.timeEntries.reduce((s, t) => s + t.hours, 0);
  const [actualHours, setActualHours] = useState(budgetedHours.toString());
  const [parts, setParts] = useState<PartUsed[]>(() =>
    job.materials.map((m) => ({ ...m, used: true, source: "van-stock" as const }))
  );
  const [extraPartName, setExtraPartName] = useState("");
  const [extraPartQty, setExtraPartQty] = useState("1");
  const [jobPhotos, setJobPhotos] = useState<CapturedPhoto[]>([]);
  const [complianceRequired, setComplianceRequired] = useState(false);
  const [cocNumber, setCocNumber] = useState("");
  const [poConfirmed, setPoConfirmed] = useState(false);
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [receiptTargetIdx, setReceiptTargetIdx] = useState<number | null>(null);

  const toggleDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Not supported", description: "Voice dictation isn't available in this browser.", duration: 3000 });
      return;
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-AU";
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
      }
      if (transcript) setJobSheet((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handlePhotoCapture = (type: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setJobPhotos(prev => [...prev, { id: `${type}-${Date.now()}`, type, dataUrl: reader.result as string }]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleReceiptCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || receiptTargetIdx === null) return;
    const reader = new FileReader();
    reader.onload = () => {
      setParts(prev => prev.map((pp, ii) => ii === receiptTargetIdx ? { ...pp, receiptPhoto: reader.result as string } : pp));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setReceiptTargetIdx(null);
  };

  const vanStockUsed = parts.filter((p) => p.used && p.source === "van-stock");
  const supplierItems = parts.filter((p) => p.used && p.source === "supplier");

  // Skip PO step if no van stock items
  const activeSteps = vanStockUsed.length > 0 ? STEPS : STEPS.filter((s) => s.id !== "po-review");
  const currentStep = activeSteps[step];
  const canNext = step < activeSteps.length - 1;
  const canPrev = step > 0;

  function handleAddExtra() {
    if (!extraPartName.trim()) return;
    setParts((prev) => [...prev, {
      id: `extra-${Date.now()}`,
      name: extraPartName.trim(),
      quantity: Number(extraPartQty) || 1,
      unit: "pcs",
      unitPrice: 0,
      supplier: "",
      used: true,
      source: "supplier" as const,
    }]);
    setExtraPartName("");
    setExtraPartQty("1");
  }

  function handleSubmit() {
    toast({
      title: returnNeeded ? "Return Visit Flagged" : "Job Completed ✅",
      description: returnNeeded
        ? `${job.jobName} marked as needing a return visit.`
        : `${job.jobName} marked as complete.`,
      duration: 3000,
    });

    if (vanStockUsed.length > 0 && poConfirmed) {
      setTimeout(() => {
        toast({
          title: "Restock PO Sent 📋",
          description: `${vanStockUsed.length} item(s) sent to supervisor for approval.`,
          duration: 4000,
        });
      }, 500);
    }

    onOpenChange(false);
    navigate("/");
  }

  const StepIcon = currentStep?.icon || Package;

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
          {activeSteps.map((s, i) => (
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

        <div className="space-y-4 min-h-[200px]">
          {/* Return */}
          {currentStep?.id === "return" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Do you need to come back?</Label>
                <Switch checked={returnNeeded} onCheckedChange={setReturnNeeded} />
              </div>
              {returnNeeded && (
                <div className="space-y-2">
                  <Label>What's needed?</Label>
                  <Textarea className="bg-white/80 dark:bg-white/20 border-border/50 text-foreground" value={returnNote} onChange={(e) => setReturnNote(e.target.value)} placeholder="e.g. Waiting on parts, need to finish wiring..." rows={3} />
                </div>
              )}
            </div>
          )}

          {/* Job sheet */}
          {currentStep?.id === "jobsheet" && (
            <div className="space-y-3">
              <Label>Quick phrases</Label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Arrived on site",
                  "Spoke with customer",
                  "Diagnosed fault",
                  "Tested and commissioned",
                  "Cleaned up site",
                  "Left materials on site",
                  "Isolated power/water",
                  "Work completed as quoted",
                ].map((phrase) => {
                  const active = selectedPhrases.includes(phrase);
                  return (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => {
                        if (active) {
                          setSelectedPhrases((p) => p.filter((x) => x !== phrase));
                          setJobSheet((prev) => prev.replace(`\n• ${phrase}`, "").replace(`• ${phrase}\n`, "").replace(`• ${phrase}`, "").trim());
                        } else {
                          setSelectedPhrases((p) => [...p, phrase]);
                          setJobSheet((prev) => (prev ? `${prev}\n• ${phrase}` : `• ${phrase}`));
                        }
                      }}
                      className={cn(
                        "text-xs px-2.5 py-1.5 rounded-full border transition-colors font-medium",
                        active
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-muted/50 text-muted-foreground border-border hover:bg-accent"
                      )}
                    >
                      {active && <Check className="w-3 h-3 inline mr-1" />}
                      {phrase}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <Label>What was done on this job?</Label>
                <Button
                  type="button"
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  onClick={toggleDictation}
                  className={cn("gap-1.5 h-8", isListening && "animate-pulse")}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isListening ? "Stop" : "Dictate"}
                </Button>
              </div>
              <Textarea className="bg-white/80 dark:bg-white/20 border-border/50 text-foreground min-h-[120px]" value={jobSheet} onChange={(e) => setJobSheet(e.target.value)} placeholder="Describe the work completed..." />
            </div>
          )}

          {/* Time */}
          {currentStep?.id === "time" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budgeted</span>
                <span className="font-semibold">{budgetedHours} hrs</span>
              </div>
              <div className="space-y-1.5">
                <Label>Actual hours</Label>
                <Input className="bg-white/80 dark:bg-white/20 border-border/50 text-foreground" type="number" step="0.5" value={actualHours} onChange={(e) => setActualHours(e.target.value)} />
              </div>
              {Number(actualHours) > budgetedHours && (
                <p className="text-xs text-[hsl(var(--status-orange))]">⚠ {(Number(actualHours) - budgetedHours).toFixed(1)} hrs over budget</p>
              )}
            </div>
          )}

          {/* Parts */}
          {currentStep?.id === "parts" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Mark source: <strong>Van Stock</strong> (generates restock PO) or <strong>Supplier</strong> (attach receipt).
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {parts.map((p, i) => (
                  <div key={p.id} className={cn(
                    "p-2.5 rounded-lg border transition-colors space-y-2",
                    p.used ? "bg-accent/20 border-border" : "bg-muted/20 border-transparent opacity-50"
                  )}>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={p.used} onCheckedChange={(checked) => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, used: !!checked } : pp))} />
                      <span className={cn("text-sm flex-1 font-medium", !p.used && "line-through text-muted-foreground")}>{p.name}</span>
                      <Input type="number" className="w-16 h-7 text-xs text-right" value={p.quantity} disabled={!p.used} onChange={(e) => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, quantity: Number(e.target.value) || 0 } : pp))} />
                      <span className="text-xs text-muted-foreground w-8">{p.unit}</span>
                    </div>
                    {p.used && (
                      <div className="flex items-center gap-1.5 pl-6 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, source: "van-stock" } : pp))}
                          className={cn("flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors", p.source === "van-stock" ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground hover:bg-accent")}
                        >
                          <Truck className="w-3 h-3" /> Van Stock
                        </button>
                        <button
                          type="button"
                          onClick={() => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, source: "supplier" } : pp))}
                          className={cn("flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors", p.source === "supplier" ? "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))] ring-1 ring-[hsl(var(--status-orange)/0.3)]" : "bg-muted text-muted-foreground hover:bg-accent")}
                        >
                          <ShoppingCart className="w-3 h-3" /> Supplier
                        </button>
                        {p.source === "supplier" && (
                          <button
                            type="button"
                            onClick={() => {
                              setReceiptTargetIdx(i);
                              receiptInputRef.current?.click();
                            }}
                            className={cn(
                              "flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border-2 border-dashed transition-all",
                              p.receiptPhoto
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-muted-foreground/30 text-muted-foreground hover:border-primary/30 hover:bg-accent"
                            )}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            {p.receiptPhoto ? "Receipt Added ✓" : "Attach Receipt"}
                          </button>
                        )}
                        {p.source === "supplier" && p.receiptPhoto && (
                          <img src={p.receiptPhoto} alt="Receipt" className="w-10 h-10 rounded object-cover border border-border" />
                        )}
                      </div>
                    )}
                    {p.used && p.source === "supplier" && (
                      <Input className="h-7 text-xs ml-6 w-auto bg-white/80 dark:bg-white/20 border-border/50 text-foreground" placeholder="Supplier name..." value={p.supplierName || ""} onChange={(e) => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, supplierName: e.target.value } : pp))} />
                    )}
                  </div>
                ))}
              </div>

              {/* Add extra item */}
              <div className="space-y-1.5 pt-1 border-t border-border">
                <Label className="text-xs">Add extra item</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Item name..."
                    value={extraPartName}
                    onChange={(e) => setExtraPartName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddExtra(); } }}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={extraPartQty}
                    onChange={(e) => setExtraPartQty(e.target.value)}
                    className="w-16"
                  />
                  <Button type="button" size="sm" onClick={handleAddExtra} disabled={!extraPartName.trim()}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {vanStockUsed.length > 0 && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Truck className="w-3 h-3" /> {vanStockUsed.length} van stock
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

          {/* PO Review — shown only when van stock items exist */}
          {currentStep?.id === "po-review" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Restock Purchase Order</p>
                    <p className="text-xs text-muted-foreground">Replace van stock used on {job.jobName}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-2 space-y-1.5">
                  <div className="grid grid-cols-[1fr_60px_50px] gap-2 text-[10px] font-semibold text-muted-foreground uppercase pb-1">
                    <span>Item</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Unit</span>
                  </div>
                  {vanStockUsed.map((p) => (
                    <div key={p.id} className="grid grid-cols-[1fr_60px_50px] gap-2 text-sm items-center">
                      <span className="font-medium truncate">{p.name}</span>
                      <span className="text-right font-mono text-xs">{p.quantity}</span>
                      <span className="text-right text-xs text-muted-foreground">{p.unit}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{vanStockUsed.length} items to restock</span>
                  <Badge variant="secondary" className="text-xs">Pending Approval</Badge>
                </div>
              </div>

              <Button
                className="w-full h-12 gap-2"
                onClick={() => {
                  setPoConfirmed(true);
                  setStep((s) => s + 1);
                }}
              >
                <ClipboardList className="w-4 h-4" /> Send PO to Supervisor
              </Button>
            </div>
          )}

          {/* Photos */}
          {currentStep?.id === "photos" && (
            <div className="space-y-3">
              <Label>Job photos</Label>
              <div className="grid grid-cols-2 gap-2">
                <Card className="border-dashed cursor-pointer" onClick={() => beforeInputRef.current?.click()}>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Before photos</p>
                    <p className="text-xs font-medium text-primary mt-1">Tap to capture</p>
                  </CardContent>
                </Card>
                <Card className="border-dashed cursor-pointer" onClick={() => afterInputRef.current?.click()}>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">After photos</p>
                    <p className="text-xs font-medium text-primary mt-1">Tap to capture</p>
                  </CardContent>
                </Card>
              </div>
              {jobPhotos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">{jobPhotos.length} photo(s) added</p>
                  <div className="flex gap-2 flex-wrap">
                    {jobPhotos.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img src={photo.dataUrl} alt={photo.type} className="w-16 h-16 rounded-lg object-cover border border-border" />
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] px-1 rounded-full uppercase">{photo.type[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compliance */}
          {currentStep?.id === "compliance" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Compliance required?</Label>
                <Switch checked={complianceRequired} onCheckedChange={setComplianceRequired} />
              </div>
              {complianceRequired && (
                <div className="space-y-2">
                  <Label>COC / Certificate Number</Label>
                  <Input className="bg-white/80 dark:bg-white/20 border-border/50 text-foreground" value={cocNumber} onChange={(e) => setCocNumber(e.target.value)} placeholder="e.g. COC-2025-001" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Testing completed</span></div>
                    <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Certificate issued</span></div>
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
              {returnNeeded ? "Flag Return" : "Finished Job"}
            </Button>
          )}
        </div>

        {/* Hidden camera inputs */}
        <input ref={beforeInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture("before")} />
        <input ref={afterInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture("after")} />
        <input ref={receiptInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleReceiptCapture} />
      </DialogContent>
    </Dialog>
  );
}
