import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, ChevronLeft, ChevronRight, Camera, Clock, Package, FileText, Shield,
  RotateCcw, Truck, ShoppingCart, ClipboardList, Mic, MicOff, Maximize2, Minimize2,
  DollarSign, Receipt, Send, CheckCircle2, Plus, Trash2, Eye, EyeOff,
  AlertTriangle, Mail, MessageSquare,
} from "lucide-react";
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
import { useAppMode } from "@/contexts/AppModeContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail;
}

interface PartUsed extends MaterialItem {
  used: boolean;
  source: "van-stock" | "supplier";
  supplierName?: string;
  receiptPhoto?: string;
}

interface CapturedPhoto {
  id: string;
  type: "before" | "after";
  dataUrl: string;
}

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

const ALL_STEPS = [
  { id: "jobsheet", label: "Job Sheet", icon: FileText },
  { id: "time", label: "Time", icon: Clock },
  { id: "parts", label: "Parts Used", icon: Package },
  { id: "po-review", label: "Restock PO", icon: ClipboardList },
  { id: "return", label: "Coming Back?", icon: RotateCcw },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "reconcile", label: "Reconcile Costs", icon: DollarSign },
  { id: "invoice", label: "Generate Invoice", icon: Receipt },
  { id: "send", label: "Send", icon: Send },
  { id: "done", label: "Done", icon: CheckCircle2 },
];

function buildCostLines(job: JobDetail): CostLine[] {
  const lines: CostLine[] = [];
  const staffHours: Record<string, { hours: number }> = {};
  job.timeEntries.forEach((t) => {
    if (!staffHours[t.staff]) staffHours[t.staff] = { hours: 0 };
    staffHours[t.staff].hours += t.hours;
  });
  const staffNames = Object.keys(staffHours);
  if (staffNames.length === 0) {
    lines.push({ id: "l-default", section: "labour", description: "Labour", quotedQty: 10, quotedRate: 85, actualQty: 10, actualRate: 85, supplierMatched: true });
  } else {
    staffNames.forEach((name, i) => {
      const hrs = staffHours[name].hours;
      lines.push({ id: `l-${i}`, section: "labour", description: name, quotedQty: hrs, quotedRate: 85, actualQty: hrs + (i === 0 ? 1.5 : 0), actualRate: 85, supplierMatched: true });
    });
  }
  job.materials.forEach((m, i) => {
    lines.push({ id: `m-${i}`, section: "materials", description: m.name, quotedQty: m.quantity, quotedRate: m.unitPrice, actualQty: m.quantity, actualRate: m.unitPrice * (0.9 + Math.random() * 0.2), supplierMatched: m.supplierDoc?.matched ?? (i % 3 !== 2), supplier: m.supplier });
  });
  if (job.extrasTotal > 0) {
    lines.push({ id: "e-0", section: "extras", description: "Travel / Mileage", quotedQty: 1, quotedRate: 65, actualQty: 1, actualRate: 65, supplierMatched: true });
    lines.push({ id: "e-1", section: "extras", description: "Waste Disposal", quotedQty: 1, quotedRate: job.extrasTotal - 65, actualQty: 1, actualRate: job.extrasTotal - 65, supplierMatched: true });
  }
  return lines;
}

function buildInvoiceLines(costLines: CostLine[]): InvoiceLine[] {
  return costLines.map((c) => ({ id: c.id, description: c.description, qty: c.quotedQty, unitPrice: c.quotedRate, visible: true }));
}

export function SoleTraderCloseOutFlow({ open, onOpenChange, job }: Props) {
  const navigate = useNavigate();
  const { soleTraderPrefs } = useAppMode();
  const [step, setStep] = useState(0);

  // Completion state
  const [jobSheet, setJobSheet] = useState(job.description || `Completed ${job.jobName} at ${job.address}.`);
  const [jobSheetExpanded, setJobSheetExpanded] = useState(false);
  const jobSheetRef = useRef<HTMLTextAreaElement>(null);
  const autoResize = useCallback(() => {
    const el = jobSheetRef.current;
    if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
  }, []);
  useEffect(() => { autoResize(); }, [jobSheet, jobSheetExpanded, autoResize]);

  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const budgetedHours = job.timeEntries.reduce((s, t) => s + t.hours, 0);
  const [actualHours, setActualHours] = useState(budgetedHours.toString());
  const [parts, setParts] = useState<PartUsed[]>(() => job.materials.map((m) => ({ ...m, used: true, source: "van-stock" as const })));
  const [extraPartName, setExtraPartName] = useState("");
  const [extraPartQty, setExtraPartQty] = useState("1");
  const [returnNeeded, setReturnNeeded] = useState(false);
  const [returnNote, setReturnNote] = useState("");
  const [jobPhotos, setJobPhotos] = useState<CapturedPhoto[]>([]);
  const [complianceRequired, setComplianceRequired] = useState(false);
  const [cocNumber, setCocNumber] = useState("");
  const [poConfirmed, setPoConfirmed] = useState(false);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [receiptTargetIdx, setReceiptTargetIdx] = useState<number | null>(null);

  // Close-out state
  const [costLines, setCostLines] = useState<CostLine[]>(() => buildCostLines(job));
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>(() => buildInvoiceLines(buildCostLines(job)));
  const [sendMethod, setSendMethod] = useState<"email" | "sms" | "both">("email");
  const [invoiceNote, setInvoiceNote] = useState("");

  const vanStockUsed = parts.filter((p) => p.used && p.source === "van-stock");
  const supplierItems = parts.filter((p) => p.used && p.source === "supplier");

  // Build active steps based on prefs
  const activeSteps = useMemo(() => {
    return ALL_STEPS.filter((s) => {
      if (s.id === "parts" && !soleTraderPrefs.vanStock) return false;
      if (s.id === "po-review" && (!soleTraderPrefs.vanStock || vanStockUsed.length === 0)) return false;
      return true;
    });
  }, [soleTraderPrefs.vanStock, vanStockUsed.length]);

  const currentStep = activeSteps[step];
  const canNext = step < activeSteps.length - 1;
  const canPrev = step > 0;

  // Reconciliation totals
  const quotedTotal = costLines.reduce((s, c) => s + c.quotedQty * c.quotedRate, 0);
  const actualTotal = costLines.reduce((s, c) => s + c.actualQty * c.actualRate, 0);
  const margin = quotedTotal > 0 ? ((quotedTotal - actualTotal) / quotedTotal) * 100 : 0;
  const unmatchedCount = costLines.filter((c) => c.section === "materials" && !c.supplierMatched).length;
  const invoiceSubtotal = invoiceLines.filter((l) => l.visible).reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const gst = invoiceSubtotal * 0.15;
  const invoiceTotal = invoiceSubtotal + gst;

  const toggleDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast({ title: "Not supported", description: "Voice dictation isn't available in this browser.", duration: 3000 }); return; }
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true; recognition.interimResults = false; recognition.lang = "en-AU";
    recognition.onresult = (event: any) => { let t = ""; for (let i = event.resultIndex; i < event.results.length; i++) { if (event.results[i].isFinal) t += event.results[i][0].transcript; } if (t) setJobSheet((prev) => (prev ? `${prev} ${t.trim()}` : t.trim())); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  const handlePhotoCapture = (type: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setJobPhotos(prev => [...prev, { id: `${type}-${Date.now()}`, type, dataUrl: reader.result as string }]); };
    reader.readAsDataURL(file); e.target.value = "";
  };

  const handleReceiptCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || receiptTargetIdx === null) return;
    const reader = new FileReader();
    reader.onload = () => { setParts(prev => prev.map((pp, ii) => ii === receiptTargetIdx ? { ...pp, receiptPhoto: reader.result as string } : pp)); };
    reader.readAsDataURL(file); e.target.value = ""; setReceiptTargetIdx(null);
  };

  function handleAddExtra() {
    if (!extraPartName.trim()) return;
    setParts((prev) => [...prev, { id: `extra-${Date.now()}`, name: extraPartName.trim(), quantity: Number(extraPartQty) || 1, unit: "pcs", unitPrice: 0, supplier: "", used: true, source: "supplier" as const }]);
    setExtraPartName(""); setExtraPartQty("1");
  }

  function updateCostLine(id: string, patch: Partial<CostLine>) { setCostLines((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))); }
  function addCostLine() { setCostLines((prev) => [...prev, { id: `e-new-${Date.now()}`, section: "extras", description: "New cost", quotedQty: 0, quotedRate: 0, actualQty: 1, actualRate: 0, supplierMatched: false }]); }
  function updateInvoiceLine(id: string, patch: Partial<InvoiceLine>) { setInvoiceLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l))); }
  function addInvoiceLine() { setInvoiceLines((prev) => [...prev, { id: `inv-new-${Date.now()}`, description: "New item", qty: 1, unitPrice: 0, visible: true }]); }
  function removeInvoiceLine(id: string) { setInvoiceLines((prev) => prev.filter((l) => l.id !== id)); }

  function goToStep(next: number) {
    if (activeSteps[next]?.id === "invoice") { setInvoiceLines(buildInvoiceLines(costLines)); }
    setStep(next);
  }

  function handleComplete() {
    toast({ title: "Invoice Sent ✅", description: `$${invoiceTotal.toFixed(2)} invoice sent to ${job.client}. Job closed out.`, duration: 4000 });
    onOpenChange(false);
    navigate("/");
  }

  const StepIcon = currentStep?.icon || FileText;

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
            <button key={s.id} onClick={() => i <= step && goToStep(i)} className={cn("w-2 h-2 rounded-full transition-colors", i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20")} />
          ))}
        </div>

        <div className="space-y-4 min-h-[200px]">

          {/* ===== COMPLETION STEPS ===== */}

          {/* Job Sheet */}
          {currentStep?.id === "jobsheet" && (
            <div className="space-y-3">
              <Label>Quick phrases</Label>
              <div className="flex flex-wrap gap-1.5">
                {["Arrived on site", "Spoke with customer", "Diagnosed fault", "Tested and commissioned", "Cleaned up site", "Left materials on site", "Isolated power/water", "Work completed as quoted"].map((phrase) => {
                  const active = selectedPhrases.includes(phrase);
                  return (
                    <button key={phrase} type="button" onClick={() => {
                      if (active) { setSelectedPhrases((p) => p.filter((x) => x !== phrase)); setJobSheet((prev) => prev.replace(`\n• ${phrase}`, "").replace(`• ${phrase}\n`, "").replace(`• ${phrase}`, "").trim()); }
                      else { setSelectedPhrases((p) => [...p, phrase]); setJobSheet((prev) => (prev ? `${prev}\n• ${phrase}` : `• ${phrase}`)); }
                    }} className={cn("text-xs px-2.5 py-1.5 rounded-full border transition-colors font-medium", active ? "bg-primary/15 text-primary border-primary/30" : "bg-muted/50 text-muted-foreground border-border hover:bg-accent")}>
                      {active && <Check className="w-3 h-3 inline mr-1" />}{phrase}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <Label>What was done on this job?</Label>
                <Button type="button" variant={isListening ? "default" : "outline"} size="sm" onClick={toggleDictation} className={cn("gap-1.5 h-8", isListening && "animate-pulse")}>
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}{isListening ? "Stop" : "Dictate"}
                </Button>
              </div>
              <Textarea ref={jobSheetRef} className={cn("bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400 min-h-[120px] resize-none transition-all", jobSheetExpanded ? "overflow-hidden" : "max-h-[50vh] overflow-y-auto")} value={jobSheet} onChange={(e) => setJobSheet(e.target.value)} placeholder="Describe the work completed..." />
              {jobSheet && jobSheet.length > 100 && (
                <Button type="button" variant="ghost" size="sm" className="gap-1 h-7 text-xs text-muted-foreground" onClick={() => setJobSheetExpanded(!jobSheetExpanded)}>
                  {jobSheetExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}{jobSheetExpanded ? "Collapse" : "Expand"}
                </Button>
              )}
            </div>
          )}

          {/* Time */}
          {currentStep?.id === "time" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Budgeted</span><span className="font-semibold">{budgetedHours} hrs</span></div>
              <div className="space-y-1.5"><Label>Actual hours</Label><Input className="bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400" type="number" step="0.5" value={actualHours} onChange={(e) => setActualHours(e.target.value)} /></div>
              {Number(actualHours) > budgetedHours && <p className="text-xs text-[hsl(var(--status-orange))]">⚠ {(Number(actualHours) - budgetedHours).toFixed(1)} hrs over budget</p>}
            </div>
          )}

          {/* Parts */}
          {currentStep?.id === "parts" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Mark source: <strong>Van Stock</strong> (generates restock PO) or <strong>Supplier</strong> (attach receipt).</p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {parts.map((p, i) => (
                  <div key={p.id} className={cn("p-2.5 rounded-lg border transition-colors space-y-2", p.used ? "bg-accent/20 border-border" : "bg-muted/20 border-transparent opacity-50")}>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={p.used} onCheckedChange={(checked) => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, used: !!checked } : pp))} />
                      <span className={cn("text-sm flex-1 font-medium", !p.used && "line-through text-muted-foreground")}>{p.name}</span>
                      <Input type="number" className="w-16 h-7 text-xs text-right" value={p.quantity} disabled={!p.used} onChange={(e) => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, quantity: Number(e.target.value) || 0 } : pp))} />
                      <span className="text-xs text-muted-foreground w-8">{p.unit}</span>
                    </div>
                    {p.used && (
                      <div className="flex items-center gap-1.5 pl-6 flex-wrap">
                        <button type="button" onClick={() => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, source: "van-stock" } : pp))} className={cn("flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors", p.source === "van-stock" ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground hover:bg-accent")}>
                          <Truck className="w-3 h-3" /> Van Stock
                        </button>
                        <button type="button" onClick={() => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, source: "supplier" } : pp))} className={cn("flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors", p.source === "supplier" ? "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))] ring-1 ring-[hsl(var(--status-orange)/0.3)]" : "bg-muted text-muted-foreground hover:bg-accent")}>
                          <ShoppingCart className="w-3 h-3" /> Supplier
                        </button>
                        {p.source === "supplier" && (
                          <button type="button" onClick={() => { setReceiptTargetIdx(i); receiptInputRef.current?.click(); }} className={cn("flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border-2 border-dashed transition-all", p.receiptPhoto ? "border-primary/40 bg-primary/10 text-primary" : "border-muted-foreground/30 text-muted-foreground hover:border-primary/30 hover:bg-accent")}>
                            <Camera className="w-3.5 h-3.5" />{p.receiptPhoto ? "Receipt Added ✓" : "Attach Receipt"}
                          </button>
                        )}
                      </div>
                    )}
                    {p.used && p.source === "supplier" && (
                      <Input className="h-7 text-xs ml-6 w-auto bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400" placeholder="Supplier name..." value={p.supplierName || ""} onChange={(e) => setParts((prev) => prev.map((pp, ii) => ii === i ? { ...pp, supplierName: e.target.value } : pp))} />
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 pt-1 border-t border-border">
                <Label className="text-xs">Add extra item</Label>
                <div className="flex gap-2">
                  <Input placeholder="Item name..." value={extraPartName} onChange={(e) => setExtraPartName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddExtra(); } }} className="flex-1" />
                  <Input type="number" placeholder="Qty" value={extraPartQty} onChange={(e) => setExtraPartQty(e.target.value)} className="w-16" />
                  <Button type="button" size="sm" onClick={handleAddExtra} disabled={!extraPartName.trim()}>Add</Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {vanStockUsed.length > 0 && <Badge variant="secondary" className="gap-1 text-xs"><Truck className="w-3 h-3" /> {vanStockUsed.length} van stock</Badge>}
                {supplierItems.length > 0 && <Badge variant="outline" className="gap-1 text-xs"><ShoppingCart className="w-3 h-3" /> {supplierItems.length} from supplier</Badge>}
              </div>
            </div>
          )}

          {/* PO Review */}
          {currentStep?.id === "po-review" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-3">
                <div className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-primary" /><div><p className="text-sm font-bold text-foreground">Restock Purchase Order</p><p className="text-xs text-muted-foreground">Replace van stock used on {job.jobName}</p></div></div>
                <div className="border-t border-border pt-2 space-y-1.5">
                  <div className="grid grid-cols-[1fr_60px_50px] gap-2 text-[10px] font-semibold text-muted-foreground uppercase pb-1"><span>Item</span><span className="text-right">Qty</span><span className="text-right">Unit</span></div>
                  {vanStockUsed.map((p) => (<div key={p.id} className="grid grid-cols-[1fr_60px_50px] gap-2 text-sm items-center"><span className="font-medium truncate">{p.name}</span><span className="text-right font-mono text-xs">{p.quantity}</span><span className="text-right text-xs text-muted-foreground">{p.unit}</span></div>))}
                </div>
                <div className="border-t border-border pt-2 flex items-center justify-between"><span className="text-xs text-muted-foreground">{vanStockUsed.length} items to restock</span><Badge variant="secondary" className="text-xs">Pending Approval</Badge></div>
              </div>
              <Button className="w-full h-12 gap-2" onClick={() => { setPoConfirmed(true); goToStep(step + 1); }}><ClipboardList className="w-4 h-4" /> Send PO to Supervisor</Button>
            </div>
          )}

          {/* Return */}
          {currentStep?.id === "return" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Do you need to come back?</Label><Switch checked={returnNeeded} onCheckedChange={setReturnNeeded} /></div>
              {returnNeeded && (<div className="space-y-2"><Label>What's needed?</Label><Textarea className="bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400" value={returnNote} onChange={(e) => setReturnNote(e.target.value)} placeholder="e.g. Waiting on parts, need to finish wiring..." rows={3} /></div>)}
            </div>
          )}

          {/* Photos */}
          {currentStep?.id === "photos" && (
            <div className="space-y-3">
              <Label>Job photos</Label>
              <div className="grid grid-cols-2 gap-2">
                <Card className="border-dashed cursor-pointer" onClick={() => beforeInputRef.current?.click()}><CardContent className="p-6 flex flex-col items-center justify-center text-center"><Camera className="w-8 h-8 text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Before photos</p><p className="text-xs font-medium text-primary mt-1">Tap to capture</p></CardContent></Card>
                <Card className="border-dashed cursor-pointer" onClick={() => afterInputRef.current?.click()}><CardContent className="p-6 flex flex-col items-center justify-center text-center"><Camera className="w-8 h-8 text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">After photos</p><p className="text-xs font-medium text-primary mt-1">Tap to capture</p></CardContent></Card>
              </div>
              {jobPhotos.length > 0 && (<div className="space-y-2"><p className="text-xs text-muted-foreground">{jobPhotos.length} photo(s) added</p><div className="flex gap-2 flex-wrap">{jobPhotos.map((photo) => (<div key={photo.id} className="relative"><img src={photo.dataUrl} alt={photo.type} className="w-16 h-16 rounded-lg object-cover border border-border" /><span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] px-1 rounded-full uppercase">{photo.type[0]}</span></div>))}</div></div>)}
            </div>
          )}

          {/* Compliance */}
          {currentStep?.id === "compliance" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Compliance required?</Label><Switch checked={complianceRequired} onCheckedChange={setComplianceRequired} /></div>
              {complianceRequired && (<div className="space-y-2"><Label>COC / Certificate Number</Label><Input className="bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400" value={cocNumber} onChange={(e) => setCocNumber(e.target.value)} placeholder="e.g. COC-2025-001" /><div className="space-y-1"><div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Testing completed</span></div><div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Certificate issued</span></div></div></div>)}
            </div>
          )}

          {/* ===== CLOSE-OUT STEPS ===== */}

          {/* Reconcile Costs */}
          {currentStep?.id === "reconcile" && (
            <div className="space-y-3">
              {soleTraderPrefs.reconcileDocs && unmatchedCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--status-orange))] bg-[hsl(var(--status-orange)/0.1)] rounded-md px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5" />{unmatchedCount} material{unmatchedCount > 1 ? "s" : ""} without supplier doc match
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Labour</Label>
                {costLines.filter((c) => c.section === "labour").map((line) => (
                  <div key={line.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 text-sm">
                    <span className="flex-1 text-card-foreground truncate">{line.description}</span>
                    <Input type="number" value={line.actualQty} onChange={(e) => updateCostLine(line.id, { actualQty: parseFloat(e.target.value) || 0 })} className="w-16 h-7 text-xs text-center" />
                    <span className="text-xs text-muted-foreground">hrs ×</span>
                    <Input type="number" value={line.actualRate} onChange={(e) => updateCostLine(line.id, { actualRate: parseFloat(e.target.value) || 0 })} className="w-16 h-7 text-xs text-center" />
                    <span className="w-16 text-right text-xs font-semibold text-card-foreground">${(line.actualQty * line.actualRate).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Materials</Label>
                {costLines.filter((c) => c.section === "materials").map((line) => {
                  const diff = (line.actualQty * line.actualRate) - (line.quotedQty * line.quotedRate);
                  const over = diff > 1;
                  return (
                    <div key={line.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 text-sm">
                      {soleTraderPrefs.reconcileDocs && (
                        <button onClick={() => updateCostLine(line.id, { supplierMatched: !line.supplierMatched })} className={cn("w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors", line.supplierMatched ? "bg-[hsl(var(--status-green)/0.15)] border-[hsl(var(--status-green)/0.4)] text-[hsl(var(--status-green))]" : "bg-[hsl(var(--status-orange)/0.1)] border-[hsl(var(--status-orange)/0.4)] text-[hsl(var(--status-orange))]")} title={line.supplierMatched ? "Receipt matched" : "Unmatched"}>
                          {line.supplierMatched ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        </button>
                      )}
                      <div className="flex-1 min-w-0"><span className="text-card-foreground text-xs truncate block">{line.description}</span>{line.supplier && <span className="text-[10px] text-muted-foreground">{line.supplier}</span>}</div>
                      <Input type="number" value={line.actualQty} onChange={(e) => updateCostLine(line.id, { actualQty: parseFloat(e.target.value) || 0 })} className="w-12 h-7 text-xs text-center" />
                      <span className="text-[10px] text-muted-foreground">×</span>
                      <Input type="number" value={Math.round(line.actualRate * 100) / 100} onChange={(e) => updateCostLine(line.id, { actualRate: parseFloat(e.target.value) || 0 })} className="w-16 h-7 text-xs text-center" />
                      <span className={cn("w-14 text-right text-xs font-semibold", over ? "text-[hsl(var(--status-orange))]" : "text-card-foreground")}>${(line.actualQty * line.actualRate).toFixed(0)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Extras</Label>
                {costLines.filter((c) => c.section === "extras").map((line) => (
                  <div key={line.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 text-sm">
                    <Input value={line.description} onChange={(e) => updateCostLine(line.id, { description: e.target.value })} className="flex-1 h-7 text-xs" />
                    <Input type="number" value={line.actualQty} onChange={(e) => updateCostLine(line.id, { actualQty: parseFloat(e.target.value) || 0 })} className="w-12 h-7 text-xs text-center" />
                    <span className="text-[10px] text-muted-foreground">×</span>
                    <Input type="number" value={line.actualRate} onChange={(e) => updateCostLine(line.id, { actualRate: parseFloat(e.target.value) || 0 })} className="w-16 h-7 text-xs text-center" />
                    <span className="w-14 text-right text-xs font-semibold text-card-foreground">${(line.actualQty * line.actualRate).toFixed(0)}</span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="gap-1 text-xs mt-1" onClick={addCostLine}><Plus className="w-3.5 h-3.5" /> Add Cost</Button>
              </div>
              <Card className={cn("border-2", margin < 0 ? "border-[hsl(var(--status-red)/0.4)]" : margin < 10 ? "border-[hsl(var(--status-orange)/0.4)]" : "border-[hsl(var(--status-green)/0.4)]")}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between text-sm"><span className="font-bold text-card-foreground">Quoted</span><span className="text-muted-foreground font-semibold">${quotedTotal.toFixed(0)}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="font-bold text-card-foreground">Actual</span><span className="font-bold text-card-foreground">${actualTotal.toFixed(0)}</span></div>
                  <div className="flex items-center justify-between text-sm pt-1 border-t border-border/50 mt-1"><span className="font-bold">Margin</span><span className={cn("font-bold", margin < 0 ? "text-[hsl(var(--status-red))]" : margin < 10 ? "text-[hsl(var(--status-orange))]" : "text-[hsl(var(--status-green))]")}>{margin.toFixed(1)}%</span></div>
                  {margin < 0 && <p className="text-xs text-[hsl(var(--status-red))] flex items-center gap-1 mt-2"><AlertTriangle className="w-3 h-3" /> Over budget — review before invoicing</p>}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Generate Invoice */}
          {currentStep?.id === "invoice" && (
            <div className="space-y-3">
              <Card><CardContent className="pt-4 space-y-1"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Client</span><span className="font-semibold text-card-foreground">{job.client}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Job</span><span className="font-medium text-card-foreground">{job.jobName}</span></div></CardContent></Card>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider px-1"><span className="w-5" /><span className="flex-1">Description</span><span className="w-12 text-center">Qty</span><span className="w-16 text-center">Price</span><span className="w-14 text-right">Total</span><span className="w-6" /></div>
                {invoiceLines.map((line) => (
                  <div key={line.id} className={cn("flex items-center gap-2 py-1 border-b border-border/30", !line.visible && "opacity-40")}>
                    <button onClick={() => updateInvoiceLine(line.id, { visible: !line.visible })} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground">{line.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
                    <Input value={line.description} onChange={(e) => updateInvoiceLine(line.id, { description: e.target.value })} className="flex-1 h-7 text-xs" />
                    <Input type="number" value={line.qty} onChange={(e) => updateInvoiceLine(line.id, { qty: parseFloat(e.target.value) || 0 })} className="w-12 h-7 text-xs text-center" />
                    <Input type="number" value={Math.round(line.unitPrice * 100) / 100} onChange={(e) => updateInvoiceLine(line.id, { unitPrice: parseFloat(e.target.value) || 0 })} className="w-16 h-7 text-xs text-center" />
                    <span className="w-14 text-right text-xs font-semibold text-card-foreground">${(line.qty * line.unitPrice).toFixed(0)}</span>
                    <button onClick={() => removeInvoiceLine(line.id)} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="gap-1 text-xs mt-1" onClick={addInvoiceLine}><Plus className="w-3.5 h-3.5" /> Add Line Item</Button>
              </div>
              <Card><CardContent className="pt-3 pb-3 space-y-1"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold text-card-foreground">${invoiceSubtotal.toFixed(2)}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (15%)</span><span className="text-card-foreground">${gst.toFixed(2)}</span></div><div className="flex justify-between text-base font-bold pt-1 border-t border-border"><span>Total</span><span>${invoiceTotal.toFixed(2)}</span></div></CardContent></Card>
              <div className="space-y-1.5"><Label>Invoice note (optional)</Label><Textarea value={invoiceNote} onChange={(e) => setInvoiceNote(e.target.value)} placeholder="e.g. Payment due within 14 days..." rows={2} className="text-sm" /></div>
            </div>
          )}

          {/* Send */}
          {currentStep?.id === "send" && (
            <div className="space-y-4">
              <Card><CardContent className="pt-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">To</span><span className="font-semibold text-card-foreground">{job.client}</span></div>
                {job.clientEmail && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Email</span><span className="text-card-foreground">{job.clientEmail}</span></div>}
                {job.clientPhone && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Phone</span><span className="text-card-foreground">{job.clientPhone}</span></div>}
                <div className="flex justify-between text-sm font-bold"><span>Invoice Total</span><span>${invoiceTotal.toFixed(2)}</span></div>
              </CardContent></Card>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Delivery Method</Label>
                <div className="flex gap-2">
                  {([{ id: "email" as const, label: "Email", icon: Mail }, { id: "sms" as const, label: "SMS", icon: MessageSquare }, { id: "both" as const, label: "Both", icon: Send }]).map((m) => (
                    <button key={m.id} onClick={() => setSendMethod(m.id)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all", sendMethod === m.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent")}>
                      <m.icon className="w-4 h-4" />{m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Done */}
          {currentStep?.id === "done" && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--status-green)/0.15)] flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-[hsl(var(--status-green))]" /></div>
              <div><h3 className="text-lg font-bold text-card-foreground">Invoice Ready to Send</h3><p className="text-sm text-muted-foreground mt-1">${invoiceTotal.toFixed(2)} to {job.client} via {sendMethod === "both" ? "email & SMS" : sendMethod}</p></div>
              <Card><CardContent className="pt-3 pb-3"><div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Quoted</span><div className="font-semibold">${quotedTotal.toFixed(0)}</div></div>
                <div><span className="text-muted-foreground text-xs">Actual Cost</span><div className="font-semibold">${actualTotal.toFixed(0)}</div></div>
                <div><span className="text-muted-foreground text-xs">Margin</span><div className={cn("font-bold", margin < 0 ? "text-[hsl(var(--status-red))]" : "text-[hsl(var(--status-green))]")}>{margin.toFixed(1)}%</div></div>
                <div><span className="text-muted-foreground text-xs">Delivery</span><div className="font-semibold capitalize">{sendMethod === "both" ? "Email + SMS" : sendMethod}</div></div>
              </div></CardContent></Card>
              <div className="flex flex-col gap-2 pt-2">
                <Button size="lg" className="w-full h-12 gap-2" onClick={handleComplete}><Send className="w-5 h-5" /> Send Invoice & Close Out</Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep?.id !== "done" && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => goToStep(step - 1)} disabled={!canPrev} className="gap-1"><ChevronLeft className="w-4 h-4" /> Back</Button>
            <span className="text-xs text-muted-foreground">{step + 1} of {activeSteps.length}</span>
            <Button size="sm" onClick={() => goToStep(step + 1)} disabled={!canNext} className="gap-1">Next <ChevronRight className="w-4 h-4" /></Button>
          </div>
        )}

        {/* Hidden inputs */}
        <input ref={beforeInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture("before")} />
        <input ref={afterInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture("after")} />
        <input ref={receiptInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleReceiptCapture} />
      </DialogContent>
    </Dialog>
  );
}
