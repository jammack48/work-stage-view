import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, ChevronLeft, ChevronRight, Camera, Clock, Package, FileText, Shield,
  CheckCircle2, CalendarDays, Mic, MicOff, Volume2, VolumeX, Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { JobDetail, MaterialItem } from "@/data/dummyJobDetails";
import { toast } from "@/hooks/use-toast";

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-closeout`;

interface AICloseOutFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail;
}

interface PartUsed extends MaterialItem {
  used: boolean;
}

interface CapturedPhoto {
  id: string;
  type: "before" | "after";
  dataUrl: string;
}

type StepId = "status" | "jobsheet" | "time" | "parts" | "photos" | "compliance";

const STEPS: { id: StepId; label: string; icon: any }[] = [
  { id: "status", label: "Job Status", icon: CheckCircle2 },
  { id: "jobsheet", label: "Job Sheet", icon: FileText },
  { id: "time", label: "Time", icon: Clock },
  { id: "parts", label: "Parts Used", icon: Package },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "compliance", label: "Compliance", icon: Shield },
];

const STEP_QUESTIONS: Record<StepId, (job: JobDetail, parts: PartUsed[]) => string> = {
  status: () => "Finished or coming back?",
  jobsheet: () => "What'd you do?",
  time: () => "How many hours?",
  parts: (_job, parts) => {
    const names = parts.filter(p => p.used).map(p => p.name).join(", ");
    return names ? `Used ${names}?` : "Any parts?";
  },
  photos: () => "Any photos?",
  compliance: () => "Any compliance certs?",
};

// ── AI call (non-streaming) ──

async function callAI(payload: {
  step: StepId;
  question: string;
  transcript: string;
  job: { name: string; address: string; materials: string[] };
}) {
  console.log("[AI CloseOut] Calling AI:", payload.step, payload.transcript);
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();
  console.log("[AI CloseOut] AI response:", data);
  return data as { speak: string; actions: { type: string; value?: any }[]; advance: boolean };
}

// ── Speech Recognition (continuous) ──

function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef<((text: string) => void) | null>(null);
  const shouldListenRef = useRef(false);
  const isMutedRef = useRef(false);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const createRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-AU";

    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let lastInterim = "";

    r.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          // Clear any pending silence timer — we got a final result
          if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
          lastInterim = "";
          const t = e.results[i][0].transcript.trim();
          console.log("[AI CloseOut] Heard (final):", t);
          if (t && onResultRef.current) onResultRef.current(t);
        } else {
          // Interim result — start silence timer to auto-finalize short words
          const interim = e.results[i][0].transcript.trim();
          if (interim) {
            lastInterim = interim;
            if (silenceTimer) clearTimeout(silenceTimer);
            silenceTimer = setTimeout(() => {
              if (lastInterim && onResultRef.current) {
                console.log("[AI CloseOut] Heard (silence timeout):", lastInterim);
                onResultRef.current(lastInterim);
                lastInterim = "";
              }
            }, 1500);
          }
        }
      }
    };
    r.onend = () => {
      setIsListening(false);
      // Flush any pending interim
      if (lastInterim && onResultRef.current) {
        console.log("[AI CloseOut] Heard (onend flush):", lastInterim);
        onResultRef.current(lastInterim);
        lastInterim = "";
      }
      if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
      if (shouldListenRef.current && !isMutedRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current && !isMutedRef.current && recognitionRef.current) {
            try { recognitionRef.current.start(); setIsListening(true); } catch { /* */ }
          }
        }, 200);
      }
    };
    r.onerror = (ev: any) => {
      if (ev.error !== "no-speech" && ev.error !== "aborted") {
        console.warn("[AI CloseOut] Speech error:", ev.error);
      }
    };
    return r;
  }, []);

  const start = useCallback((cb: (text: string) => void) => {
    onResultRef.current = cb;
    shouldListenRef.current = true;
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch { /* */ }
    const r = createRecognition();
    if (!r) { toast({ title: "Speech not supported", variant: "destructive" }); return; }
    recognitionRef.current = r;
    try { r.start(); setIsListening(true); } catch { /* */ }
  }, [createRecognition]);

  const pause = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch { /* */ }
    setIsListening(false);
  }, []);

  const resume = useCallback(() => {
    if (isMutedRef.current) return;
    shouldListenRef.current = true;
    if (!recognitionRef.current) {
      const r = createRecognition();
      if (r) { recognitionRef.current = r; }
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); setIsListening(true); } catch { /* */ }
    }
  }, [createRecognition]);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    onResultRef.current = null;
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch { /* */ }
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) { pause(); }
      return !prev;
    });
  }, [pause]);

  // Allow updating callback without restarting
  const updateCallback = useCallback((cb: (text: string) => void) => {
    onResultRef.current = cb;
  }, []);

  return { isListening, isMuted, start, pause, resume, stop, toggleMute, updateCallback };
}

// ── TTS ──

function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!enabled || !window.speechSynthesis) { onEnd?.(); return; }
    const clean = text.replace(/[#*_`~>\[\]()!]/g, "").replace(/\n+/g, ". ").replace(/\s+/g, " ").trim();
    if (!clean) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.35; u.pitch = 1.0; u.lang = "en-AU";
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); onEnd?.(); };
    u.onerror = () => { setIsSpeaking(false); onEnd?.(); };
    window.speechSynthesis.speak(u);
  }, [enabled]);

  const cancel = useCallback(() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }, []);
  const toggle = useCallback(() => setEnabled(p => { if (p) { window.speechSynthesis.cancel(); setIsSpeaking(false); } return !p; }), []);

  return { isSpeaking, enabled, speak, cancel, toggle };
}

// ── Main Component ──

export function AICloseOutFlow({ open, onOpenChange, job }: AICloseOutFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "speaking" | "listening" | "thinking">("idle");
  const [lastSpoken, setLastSpoken] = useState("");
  const hasInitRef = useRef(false);

  // Step state
  const [jobFinished, setJobFinished] = useState(true);
  const [jobSheet, setJobSheet] = useState("");
  const [actualHours, setActualHours] = useState("");
  const [parts, setParts] = useState<PartUsed[]>(() =>
    job.materials.map(m => ({ ...m, used: true }))
  );
  const [jobPhotos, setJobPhotos] = useState<CapturedPhoto[]>([]);
  const [complianceRequired, setComplianceRequired] = useState(false);
  const [cocNumber, setCocNumber] = useState("");

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const speech = useSpeech();
  const tts = useTTS();

  const currentStep = STEPS[step];
  const budgetedHours = job.timeEntries.reduce((s, t) => s + t.hours, 0);

  // Get the question for current step
  const getQuestion = useCallback(() => {
    return STEP_QUESTIONS[currentStep.id](job, parts);
  }, [currentStep.id, job, parts]);

  // Apply AI actions to form state
  const applyActions = useCallback((actions: { type: string; value?: any }[]) => {
    for (const action of actions) {
      switch (action.type) {
        case "set_status":
          setJobFinished(action.value === "finished");
          break;
        case "set_jobsheet":
          setJobSheet(action.value || "");
          break;
        case "set_hours":
          setActualHours(String(action.value || ""));
          break;
        case "confirm_parts":
          // All parts already marked as used
          break;
        case "add_part":
          setParts(prev => [...prev, {
            id: `extra-${Date.now()}`,
            name: action.value,
            quantity: 1,
            unit: "pcs",
            unitPrice: 0,
            supplier: "",
            used: true,
          }]);
          break;
        case "remove_part":
          setParts(prev => prev.map(p =>
            p.name.toLowerCase().includes((action.value || "").toLowerCase())
              ? { ...p, used: false }
              : p
          ));
          break;
        case "skip_photos":
          break;
        case "wait_photos":
          break;
        case "set_compliance":
          setComplianceRequired(!!action.value);
          break;
        case "set_cert_number":
          setCocNumber(action.value || "");
          break;
      }
    }
  }, []);

  // Process user speech for current step
  const handleSpeech = useCallback(async (transcript: string) => {
    setProcessing(true);
    setVoiceStatus("thinking");
    speech.pause();

    try {
      const result = await callAI({
        step: currentStep.id,
        question: getQuestion(),
        transcript,
        job: {
          name: job.jobName,
          address: job.address,
          materials: job.materials.map(m => m.name),
        },
      });

      // Apply the actions to form state
      applyActions(result.actions || []);

      // Speak the response
      setVoiceStatus("speaking");
      setLastSpoken(result.speak);
      tts.speak(result.speak, () => {
        setVoiceStatus("listening");
        // Advance if told to
        if (result.advance) {
          if (step < STEPS.length - 1) {
            setStep(s => s + 1);
          } else {
            // Final step — submit
            handleSubmit();
          }
        }
        speech.resume();
      });
    } catch (e: any) {
      console.error("[AI CloseOut] Error:", e);
      setVoiceStatus("listening");
      speech.resume();
      toast({ title: "AI Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  }, [currentStep, getQuestion, job, applyActions, tts, speech, step]);

  // When step changes, speak the new question
  useEffect(() => {
    if (!open || !hasInitRef.current) return;
    const question = STEP_QUESTIONS[STEPS[step].id](job, parts);
    setLastSpoken(question);
    setVoiceStatus("speaking");
    speech.pause();
    tts.speak(question, () => {
      setVoiceStatus("listening");
      speech.resume();
    });
  }, [step]);

  // Keep speech callback updated
  useEffect(() => {
    speech.updateCallback((transcript: string) => {
      if (transcript.trim()) handleSpeech(transcript);
    });
  }, [handleSpeech, speech.updateCallback]);

  // Initialize on open
  useEffect(() => {
    if (open && !hasInitRef.current) {
      hasInitRef.current = true;
      const question = STEP_QUESTIONS["status"](job, parts);
      setLastSpoken(question);
      setVoiceStatus("speaking");
      tts.speak(question, () => {
        setVoiceStatus("listening");
        speech.start((transcript: string) => {
          if (transcript.trim()) handleSpeech(transcript);
        });
      });
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      hasInitRef.current = false;
      setStep(0);
      setJobFinished(true);
      setJobSheet("");
      setActualHours("");
      setParts(job.materials.map(m => ({ ...m, used: true })));
      setJobPhotos([]);
      setComplianceRequired(false);
      setCocNumber("");
      setVoiceStatus("idle");
      setLastSpoken("");
      speech.stop();
      tts.cancel();
    }
  }, [open]);

  const handleSubmit = () => {
    toast({ title: "✅ Job closed out!", description: `${job.jobName} has been completed.` });
    onOpenChange(false);
    navigate("/");
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

  const canNext = step < STEPS.length - 1;
  const canPrev = step > 0;
  const StepIcon = currentStep?.icon || FileText;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <StepIcon className="w-5 h-5 text-primary" />
            {currentStep?.label}
            <Badge variant="secondary" className="ml-auto text-[10px] gap-1">
              <Sparkles className="w-3 h-3" /> AI Voice
            </Badge>
          </DialogTitle>
          <DialogDescription className="sr-only">AI voice-assisted close-out for {job.jobName}</DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 px-4 pb-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setStep(i);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>

        {/* Step content — same screens as manual flow */}
        <div className="flex-1 px-4 pb-2 space-y-4 min-h-[200px]">
          {/* Status */}
          {currentStep?.id === "status" && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Is this job finished?</Label>
              <div className="flex gap-2">
                <button onClick={() => setJobFinished(true)} className={cn("flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all", jobFinished ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent")}>
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1" /> Job Finished
                </button>
                <button onClick={() => setJobFinished(false)} className={cn("flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all", !jobFinished ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent")}>
                  <CalendarDays className="w-5 h-5 mx-auto mb-1" /> Coming Back
                </button>
              </div>
            </div>
          )}

          {/* Job Sheet */}
          {currentStep?.id === "jobsheet" && (
            <div className="space-y-3">
              <Label>What was done on this job?</Label>
              <Textarea
                className="bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400 min-h-[120px]"
                value={jobSheet}
                onChange={(e) => setJobSheet(e.target.value)}
                placeholder="AI will fill this as you speak..."
              />
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
                <Input
                  className="bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 text-2xl font-bold text-center h-14"
                  type="number"
                  step="0.5"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  placeholder="0"
                />
              </div>
              {Number(actualHours) > budgetedHours && (
                <p className="text-xs text-[hsl(var(--status-orange))]">⚠ {(Number(actualHours) - budgetedHours).toFixed(1)} hrs over budget</p>
              )}
            </div>
          )}

          {/* Parts */}
          {currentStep?.id === "parts" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Parts from the quote — toggle what was used.</p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {parts.map((p, i) => (
                  <div key={p.id} className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg border transition-colors",
                    p.used ? "bg-accent/20 border-border" : "bg-muted/20 border-transparent opacity-50"
                  )}>
                    <Checkbox
                      checked={p.used}
                      onCheckedChange={(checked) => setParts(prev => prev.map((pp, ii) => ii === i ? { ...pp, used: !!checked } : pp))}
                    />
                    <span className={cn("text-sm flex-1 font-medium", !p.used && "line-through text-muted-foreground")}>{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.quantity} {p.unit}</span>
                  </div>
                ))}
              </div>
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
                    <p className="text-xs text-muted-foreground">Before</p>
                    <p className="text-xs font-medium text-primary mt-1">Tap to capture</p>
                  </CardContent>
                </Card>
                <Card className="border-dashed cursor-pointer" onClick={() => afterInputRef.current?.click()}>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">After</p>
                    <p className="text-xs font-medium text-primary mt-1">Tap to capture</p>
                  </CardContent>
                </Card>
              </div>
              {jobPhotos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {jobPhotos.map(photo => (
                    <div key={photo.id} className="relative">
                      <img src={photo.dataUrl} alt={photo.type} className="w-16 h-16 rounded-lg object-cover border border-border" />
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] px-1 rounded-full uppercase">{photo.type[0]}</span>
                    </div>
                  ))}
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
                  <Input
                    className="bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100"
                    value={cocNumber}
                    onChange={(e) => setCocNumber(e.target.value)}
                    placeholder="e.g. COC-2025-001"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Voice bar — the AI assistant overlay */}
        <div className="border-t border-border px-4 py-3 space-y-2 shrink-0 bg-muted/30">
          {/* What the AI last said */}
          {lastSpoken && (
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-snug">{lastSpoken}</p>
            </div>
          )}

          {/* Status + controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Big mic button */}
              <Button
                variant={speech.isMuted ? "outline" : "default"}
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full",
                  voiceStatus === "listening" && !speech.isMuted && "bg-green-600 hover:bg-green-700 animate-pulse",
                  voiceStatus !== "listening" && !speech.isMuted && "bg-green-600 hover:bg-green-700",
                  speech.isMuted && "border-destructive text-destructive"
                )}
                onClick={speech.toggleMute}
              >
                {speech.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {/* TTS toggle */}
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={tts.toggle}>
                {tts.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {/* Status text */}
              <span className="text-xs text-muted-foreground">
                {voiceStatus === "speaking" && <span className="text-violet-500 flex items-center gap-1"><Volume2 className="w-3 h-3 animate-pulse" /> Speaking...</span>}
                {voiceStatus === "listening" && !speech.isMuted && <span className="text-green-500 flex items-center gap-1"><Mic className="w-3 h-3 animate-pulse" /> Listening...</span>}
                {voiceStatus === "thinking" && <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 animate-spin" /> Thinking...</span>}
                {speech.isMuted && <span className="flex items-center gap-1"><MicOff className="w-3 h-3" /> Mic muted</span>}
              </span>
            </div>

            {/* Manual nav */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep(s => s - 1)} disabled={!canPrev}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {canNext ? (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep(s => s + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleSubmit} className="gap-1 bg-green-600 hover:bg-green-700">
                  <Check className="w-3.5 h-3.5" /> Done
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden camera inputs */}
        <input ref={beforeInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture("before")} />
        <input ref={afterInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture("after")} />
      </DialogContent>
    </Dialog>
  );
}
