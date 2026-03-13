import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, User, Phone, Mail, MapPin, FileText,
  Mic, MicOff, Sparkles, Minimize2, Maximize2, Clock, DollarSign,
  Package, Plus, Trash2, Send, Receipt, Loader2, Truck, PhoneCall, Settings2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAppMode } from "@/contexts/AppModeContext";

/* ─── Types ─── */
interface LabourLine {
  id: string;
  hours: number;
  rate: number;
}

interface AddOn {
  id: string;
  label: string;
  amount: number;
  enabled: boolean;
}

interface MaterialLine {
  id: string;
  name: string;
  costPrice: number;
  markup: number; // percentage
  qty: number;
}

const QUICK_PHRASES = [
  "Arrived on site",
  "Spoke with customer",
  "Diagnosed fault",
  "Completed repair",
  "Tested and commissioned",
  "Cleaned up site",
  "Left materials on site",
  "Isolated power/water",
];

const DEFAULT_ADDONS: AddOn[] = [
  { id: "van", label: "Van Charge", amount: 25, enabled: false },
  { id: "callout", label: "Call-out Fee", amount: 85, enabled: false },
  { id: "admin", label: "Admin Fee", amount: 15, enabled: false },
];

/* ─── Step dots ─── */
function StepDots({ current, total }: { current: number; total: number }) {
  const labels = ["Customer", "Work Done", "Labour", "Materials", "Invoice"];
  return (
    <div className="flex items-center gap-1">
      {labels.map((lbl, i) => (
        <div key={lbl} className="flex items-center gap-1">
          <div className={cn("w-2 h-2 rounded-full transition-colors", i <= current ? "bg-primary" : "bg-muted")} />
          {i < labels.length - 1 && <span className="text-muted-foreground/30 text-[10px]">›</span>}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─── */
export default function IntroJobFlow() {
  const navigate = useNavigate();
  const { clearMode } = useAppMode();
  const [step, setStep] = useState(0);

  // Step 0: Customer
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Step 1: What was done
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [workDescription, setWorkDescription] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Step 2: Labour
  const [labourLines, setLabourLines] = useState<LabourLine[]>([
    { id: "lab-1", hours: 1, rate: 95 },
  ]);
  const [addOns, setAddOns] = useState<AddOn[]>(DEFAULT_ADDONS);

  // Step 3: Materials
  const [materials, setMaterials] = useState<MaterialLine[]>([]);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
  }, []);
  useEffect(() => { autoResize(); }, [workDescription, descExpanded, autoResize]);

  // Dictation
  const toggleDictation = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast({ title: "Not supported", description: "Voice dictation isn't available in this browser.", duration: 3000 }); return; }
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); return; }
    const recognition = new SR();
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = "en-AU";
    recognition.onresult = (event: any) => {
      let finalT = ""; let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalT += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInterimTranscript(interim.trim());
      if (finalT) { setWorkDescription(prev => (prev ? `${prev} ${finalT.trim()}` : finalT.trim())); setInterimTranscript(""); }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => { setIsListening(false); setInterimTranscript(""); };
    recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  const togglePhrase = (phrase: string) => {
    if (selectedPhrases.includes(phrase)) {
      setSelectedPhrases(p => p.filter(x => x !== phrase));
      setWorkDescription(prev => prev.replace(`\n• ${phrase}`, "").replace(`• ${phrase}\n`, "").replace(`• ${phrase}`, "").trim());
    } else {
      setSelectedPhrases(p => [...p, phrase]);
      setWorkDescription(prev => (prev ? `${prev}\n• ${phrase}` : `• ${phrase}`));
    }
  };

  // Labour helpers
  const addLabourLine = () => setLabourLines(prev => [...prev, { id: `lab-${Date.now()}`, hours: 1, rate: 95 }]);
  const removeLabourLine = (id: string) => setLabourLines(prev => prev.filter(l => l.id !== id));
  const updateLabour = (id: string, patch: Partial<LabourLine>) => setLabourLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  const toggleAddOn = (id: string) => setAddOns(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  const updateAddOnAmount = (id: string, amount: number) => setAddOns(prev => prev.map(a => a.id === id ? { ...a, amount } : a));

  // Material helpers
  const addMaterial = () => setMaterials(prev => [...prev, { id: `mat-${Date.now()}`, name: "", costPrice: 0, markup: 20, qty: 1 }]);
  const removeMaterial = (id: string) => setMaterials(prev => prev.filter(m => m.id !== id));
  const updateMaterial = (id: string, patch: Partial<MaterialLine>) => setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));

  // Totals
  const labourTotal = labourLines.reduce((s, l) => s + l.hours * l.rate, 0);
  const addOnsTotal = addOns.filter(a => a.enabled).reduce((s, a) => s + a.amount, 0);
  const materialsTotal = materials.reduce((s, m) => s + m.costPrice * m.qty * (1 + m.markup / 100), 0);
  const subtotal = labourTotal + addOnsTotal + materialsTotal;
  const gst = subtotal * 0.15;
  const total = subtotal + gst;

  const customerName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const step0Valid = firstName.trim().length > 0 && phone.trim().length > 0;
  const step1Valid = workDescription.trim().length > 0;

  const handleSendInvoice = () => {
    toast({
      title: "Invoice Sent ✅",
      description: `$${total.toFixed(2)} invoice sent to ${customerName}.`,
      duration: 4000,
    });
    navigate("/");
  };

  const STEPS = [
    { label: "Customer", icon: User },
    { label: "Work Done", icon: FileText },
    { label: "Labour", icon: Clock },
    { label: "Materials", icon: Package },
    { label: "Invoice", icon: Receipt },
  ];

  const StepIcon = STEPS[step]?.icon || FileText;

  return (
    <div className="px-3 sm:px-6 py-4 max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : clearMode()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <StepIcon className="w-5 h-5 text-primary" />
            {STEPS[step]?.label}
          </h1>
        </div>
        <StepDots current={step} total={5} />
      </div>

      {/* ===== STEP 0: CUSTOMER ===== */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Who was the job for?</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">First Name *</Label>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className="h-11" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Last Name</Label>
              <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" className="h-11" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone *</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="021 555 1234" type="tel" className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" type="email" className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="42 Queen Street, Auckland" className="h-11" />
          </div>
          <Button className="w-full h-12 gap-2" disabled={!step0Valid} onClick={() => setStep(1)}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ===== STEP 1: WHAT WAS DONE ===== */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Tap the quick phrases or type / dictate what you did.</p>

          {/* Quick phrases */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PHRASES.map(phrase => {
              const active = selectedPhrases.includes(phrase);
              return (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => togglePhrase(phrase)}
                  className={cn(
                    "text-xs px-2.5 py-1.5 rounded-full border transition-colors font-medium",
                    active
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-accent"
                  )}
                >
                  {active && <Check className="w-3 h-3 inline mr-1" />}{phrase}
                </button>
              );
            })}
          </div>

          {/* Dictation controls */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Description</Label>
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

          {isListening && (
            <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary space-y-1">
              <div className="flex items-center gap-2 font-medium">
                <span className="inline-flex gap-1 items-end h-3" aria-hidden>
                  {[0, 1, 2, 3].map(bar => (
                    <span key={bar} className="w-1 rounded-full bg-primary/80 animate-pulse" style={{ height: `${8 + (bar % 2) * 4}px`, animationDelay: `${bar * 120}ms` }} />
                  ))}
                </span>
                Listening… speak now
              </div>
              {interimTranscript && <p className="text-primary/80">Heard: "{interimTranscript}"</p>}
            </div>
          )}

          <Textarea
            ref={textareaRef}
            className={cn(
              "bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400 min-h-[120px] resize-none transition-all",
              descExpanded ? "overflow-hidden" : "max-h-[50vh] overflow-y-auto"
            )}
            value={workDescription}
            onChange={e => setWorkDescription(e.target.value)}
            placeholder="Describe the work completed…"
          />
          {workDescription.length > 100 && (
            <Button type="button" variant="ghost" size="sm" className="gap-1 h-7 text-xs text-muted-foreground" onClick={() => setDescExpanded(!descExpanded)}>
              {descExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              {descExpanded ? "Collapse" : "Expand"}
            </Button>
          )}

          <Button className="w-full h-12 gap-2" disabled={!step1Valid} onClick={() => setStep(2)}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ===== STEP 2: LABOUR + ADD-ONS ===== */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">How long did it take and at what rate?</p>

          {/* Labour lines */}
          <div className="space-y-2">
            {labourLines.map(line => (
              <div key={line.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase">Hours</span>
                    <Input type="number" step="0.5" min="0" value={line.hours} onChange={e => updateLabour(line.id, { hours: parseFloat(e.target.value) || 0 })} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase">$/hr</span>
                    <Input type="number" min="0" value={line.rate} onChange={e => updateLabour(line.id, { rate: parseFloat(e.target.value) || 0 })} className="h-9 text-sm" />
                  </div>
                </div>
                <div className="text-right min-w-[60px]">
                  <span className="text-xs font-bold text-card-foreground">${(line.hours * line.rate).toFixed(0)}</span>
                </div>
                {labourLines.length > 1 && (
                  <button onClick={() => removeLabourLine(line.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={addLabourLine}>
              <Plus className="w-3.5 h-3.5" /> Add Labour Line
            </Button>
          </div>

          {/* Add-ons */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5" /> Optional Extras
            </Label>
            {addOns.map(addon => (
              <div key={addon.id} className="flex items-center gap-2">
                <button
                  onClick={() => toggleAddOn(addon.id)}
                  className={cn(
                    "flex-1 flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all text-left",
                    addon.enabled
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:bg-accent/50"
                  )}
                >
                  {addon.id === "van" && <Truck className="w-4 h-4 text-muted-foreground shrink-0" />}
                  {addon.id === "callout" && <PhoneCall className="w-4 h-4 text-muted-foreground shrink-0" />}
                  {addon.id === "admin" && <Settings2 className="w-4 h-4 text-muted-foreground shrink-0" />}
                  <span className={cn("text-sm font-medium", addon.enabled ? "text-primary" : "text-card-foreground")}>{addon.label}</span>
                </button>
                <Input
                  type="number"
                  min="0"
                  value={addon.amount}
                  onChange={e => updateAddOnAmount(addon.id, parseFloat(e.target.value) || 0)}
                  className="w-20 h-9 text-sm text-right"
                />
              </div>
            ))}
          </div>

          <Card>
            <CardContent className="pt-3 pb-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Labour</span>
                <span className="font-semibold text-card-foreground">${labourTotal.toFixed(2)}</span>
              </div>
              {addOnsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Extras</span>
                  <span className="font-semibold text-card-foreground">${addOnsTotal.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Button className="w-full h-12 gap-2" onClick={() => setStep(3)}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ===== STEP 3: MATERIALS ===== */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Add any materials used. Set your cost price and markup.</p>

          <div className="space-y-2">
            {materials.map(mat => (
              <div key={mat.id} className="p-3 rounded-lg border border-border bg-card space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={mat.name}
                    onChange={e => updateMaterial(mat.id, { name: e.target.value })}
                    placeholder="Material name"
                    className="flex-1 h-9 text-sm"
                  />
                  <Input
                    type="number"
                    min="1"
                    value={mat.qty}
                    onChange={e => updateMaterial(mat.id, { qty: parseInt(e.target.value) || 1 })}
                    className="w-14 h-9 text-sm text-center"
                    placeholder="Qty"
                  />
                  <button onClick={() => removeMaterial(mat.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase">Cost $</span>
                    <Input type="number" min="0" step="0.01" value={mat.costPrice} onChange={e => updateMaterial(mat.id, { costPrice: parseFloat(e.target.value) || 0 })} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase">Markup %</span>
                    <Input type="number" min="0" value={mat.markup} onChange={e => updateMaterial(mat.id, { markup: parseFloat(e.target.value) || 0 })} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase">Sell $</span>
                    <div className="h-8 flex items-center text-xs font-semibold text-card-foreground">
                      ${(mat.costPrice * mat.qty * (1 + mat.markup / 100)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full gap-2" onClick={addMaterial}>
            <Plus className="w-4 h-4" /> Add Material
          </Button>

          {materials.length > 0 && (
            <Card>
              <CardContent className="pt-3 pb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Materials Total</span>
                  <span className="font-semibold text-card-foreground">${materialsTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button className="w-full h-12 gap-2" onClick={() => setStep(4)}>
            Review Invoice <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ===== STEP 4: INVOICE SUMMARY ===== */}
      {step === 4 && (
        <div className="space-y-4">
          {/* Customer summary */}
          <Card>
            <CardContent className="pt-4 pb-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-semibold text-card-foreground">{customerName}</span>
              </div>
              {phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-card-foreground">{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-card-foreground">{email}</span>
                </div>
              )}
              {address && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-card-foreground truncate ml-4">{address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work summary */}
          {workDescription && (
            <Card>
              <CardContent className="pt-3 pb-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Work Done</Label>
                <p className="text-sm text-card-foreground mt-1 whitespace-pre-line">{workDescription}</p>
              </CardContent>
            </Card>
          )}

          {/* Line items */}
          <Card>
            <CardContent className="pt-3 pb-3 space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Invoice Lines</Label>
              {labourLines.map(l => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span className="text-card-foreground">Labour — {l.hours}h @ ${l.rate}/hr</span>
                  <span className="font-semibold">${(l.hours * l.rate).toFixed(2)}</span>
                </div>
              ))}
              {addOns.filter(a => a.enabled).map(a => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-card-foreground">{a.label}</span>
                  <span className="font-semibold">${a.amount.toFixed(2)}</span>
                </div>
              ))}
              {materials.filter(m => m.name.trim()).map(m => (
                <div key={m.id} className="flex justify-between text-sm">
                  <span className="text-card-foreground">{m.name} × {m.qty}</span>
                  <span className="font-semibold">${(m.costPrice * m.qty * (1 + m.markup / 100)).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t border-border pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-card-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (15%)</span>
                  <span className="text-card-foreground">${gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 border-t border-border">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full h-12 gap-2" onClick={handleSendInvoice}>
            <Send className="w-5 h-5" /> Send Invoice
          </Button>
        </div>
      )}
    </div>
  );
}
