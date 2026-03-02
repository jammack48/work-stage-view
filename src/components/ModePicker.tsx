import { useState } from "react";
import { Shield, Wrench, HardHat, ArrowRight } from "lucide-react";
import { useAppMode } from "@/contexts/AppModeContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ModePicker() {
  const { setMode, setSoleTraderPrefs } = useAppMode();
  const { setTutorialOn } = useTutorial();
  const [showSetup, setShowSetup] = useState(false);
  const [vanStock, setVanStock] = useState(false);
  const [reconcileDocs, setReconcileDocs] = useState(false);

  const handleSoleTraderConfirm = () => {
    setSoleTraderPrefs({ vanStock, reconcileDocs });
    setMode("sole-trader");
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <HardHat className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">Sole Trader Setup</h1>
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
            <Button variant="outline" className="flex-1" onClick={() => setShowSetup(false)}>
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Wrench className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Tradie Toolbelt</h1>
        </div>
        <p className="text-muted-foreground text-sm">How are you using the app today?</p>
      </div>

      <div className="w-full max-w-2xl mb-5 rounded-lg bg-blue-500/10 border border-blue-500/30 px-4 py-3 text-center">
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          <strong>Tip:</strong> Choose your setup. Managers get the full pipeline. Sole traders get a mobile-first workflow with pricing and invoicing. Employees only see their schedule and job details — no pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {/* Manager */}
        <button
          onClick={() => setMode("manage")}
          className="group rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-card-foreground mb-1">Manager / Office</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Full access — pipeline, quotes, invoices, pricing, reports, and team management.
          </p>
        </button>

        {/* Sole Trader */}
        <button
          onClick={() => setShowSetup(true)}
          className="group rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
            <HardHat className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-card-foreground mb-1">Sole Trader</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Do the work AND run the business. Schedule-first with pricing, close out jobs, and invoice on the spot.
          </p>
        </button>

        {/* Employee */}
        <button
          onClick={() => { setTutorialOn(true); setMode("work"); }}
          className="group rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-card-foreground mb-1">Employee</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            On the tools. Today's schedule, job details, time tracking, photos, and notes — no pricing.
          </p>
        </button>
      </div>
    </div>
  );
}
