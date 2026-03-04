import { useState } from "react";
import { Shield, Wrench, HardHat, ArrowRight, Building2, Info, X } from "lucide-react";
import { useAppMode } from "@/contexts/AppModeContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type SubStep = null | "sole-trader-setup";

export function ModePicker() {
  const { setMode, setSoleTraderPrefs } = useAppMode();
  const { setTutorialOn } = useTutorial();
  const [subStep, setSubStep] = useState<SubStep>(null);
  const [vanStock, setVanStock] = useState(false);
  const [reconcileDocs, setReconcileDocs] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const handleSoleTraderConfirm = () => {
    setSoleTraderPrefs({ vanStock, reconcileDocs });
    setMode("sole-trader");
  };

  // Sub-step: Sole Trader setup toggles
  if (subStep === "sole-trader-setup") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <HardHat className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">On the Tools Setup</h1>
            <p className="text-sm text-muted-foreground">Customise your workflow — you can change these later in Settings.</p>
          </div>

          <div className="space-y-4 rounded-xl border-2 border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-semibold text-card-foreground">Do you carry van stock?</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Track parts used from your van and generate restock POs.</p>
              </div>
              <Switch checked={vanStock} onCheckedChange={setVanStock} />
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-semibold text-card-foreground">Do you reconcile supplier documents?</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Match supplier invoices/receipts against job costs.</p>
              </div>
              <Switch checked={reconcileDocs} onCheckedChange={setReconcileDocs} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setSubStep(null)}>
              Back
            </Button>
            <Button className="flex-1 gap-2" onClick={handleSoleTraderConfirm}>
              Let's Go <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main screen — three choices + tutorial overlay
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Tutorial Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={() => setShowOverlay(false)}>
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                <h2 className="text-base font-bold text-card-foreground">Which one are you?</h2>
              </div>
              <button onClick={() => setShowOverlay(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4.5 h-4.5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">Run the Office</p>
                  <p className="text-xs text-muted-foreground">You manage the business from a desk — quoting, invoicing, team scheduling & reports.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <HardHat className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">Owner on the Tools</p>
                  <p className="text-xs text-muted-foreground">You do the work AND run the business — schedule-first view with quoting & invoicing built in.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Wrench className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">Employee</p>
                  <p className="text-xs text-muted-foreground">You work for someone — see your schedule, log time, take photos & chat with the team.</p>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => setShowOverlay(false)}>
              Got it
            </Button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wrench className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Tradie Toolbelt</h1>
          </div>
          <p className="text-muted-foreground text-sm">Pick your role to get started.</p>
        </div>

        <div className="grid gap-3">
          {/* Run the Office */}
          <button
            onClick={() => setMode("manage")}
            className="group rounded-xl border-2 border-border bg-card p-5 text-left transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 transition-colors">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-card-foreground">Run the Office</h2>
                <p className="text-sm text-muted-foreground">Quotes, invoices, team management & reports.</p>
              </div>
            </div>
          </button>

          {/* Owner on the Tools */}
          <button
            onClick={() => setSubStep("sole-trader-setup")}
            className="group rounded-xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                <HardHat className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-card-foreground">Owner on the Tools</h2>
                <p className="text-sm text-muted-foreground">Do the work AND run the business.</p>
              </div>
            </div>
          </button>

          {/* Employee */}
          <button
            onClick={() => { setTutorialOn(true); setMode("work"); }}
            className="group rounded-xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                <Wrench className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-card-foreground">Employee</h2>
                <p className="text-sm text-muted-foreground">Schedule, time tracking, photos & team chat.</p>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowOverlay(true)}
          className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mx-auto transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          Not sure? See what each role does
        </button>
      </div>
    </div>
  );
}
