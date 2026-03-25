import { useState } from "react";
import { Shield, Wrench, HardHat, ArrowRight, Building2, Receipt } from "lucide-react";
import { useAppMode } from "@/contexts/AppModeContext";
import { useTutorial } from "@/contexts/TutorialContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/contexts/UserSettingsContext";

type SubStep = null | "manager-choice" | "sole-trader-setup";

export function ModePicker() {
  const { setMode, setSoleTraderPrefs } = useAppMode();
  const { setTutorialOn } = useTutorial();
  const { settings } = useUserSettings();
  const [subStep, setSubStep] = useState<SubStep>(null);
  const [vanStock, setVanStock] = useState(false);
  const [reconcileDocs, setReconcileDocs] = useState(false);

  const handleSoleTraderConfirm = () => {
    setSoleTraderPrefs({ vanStock, reconcileDocs });
    setMode("sole-trader");
  };

  if (subStep === "sole-trader-setup") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <HardHat className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">On the Tools Setup</h1>
          </div>

          <div className="space-y-4 rounded-xl border-2 border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-semibold text-card-foreground">Do you carry van stock?</Label>
              </div>
              <Switch checked={vanStock} onCheckedChange={setVanStock} />
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-semibold text-card-foreground">Do you reconcile supplier documents?</Label>
              </div>
              <Switch checked={reconcileDocs} onCheckedChange={setReconcileDocs} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setSubStep("manager-choice")}>Back</Button>
            <Button className="flex-1 gap-2" onClick={handleSoleTraderConfirm}>Let's Go <ArrowRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    );
  }

  if (subStep === "manager-choice") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-1">Where are you today?</h1>
          </div>

          <div className="grid gap-3">
            <button onClick={() => setMode("manage")} className="group rounded-xl border-2 border-border bg-card p-5 text-left">
              <div className="flex items-center gap-4">
                <Building2 className="w-6 h-6 text-blue-500" />
                <div><h2 className="text-base font-bold text-card-foreground">In the Office</h2></div>
              </div>
            </button>

            {settings.showToolsMode && (
              <button onClick={() => setSubStep("sole-trader-setup")} className="group rounded-xl border-2 border-border bg-card p-5 text-left">
                <div className="flex items-center gap-4">
                  <HardHat className="w-6 h-6 text-primary" />
                  <div><h2 className="text-base font-bold text-card-foreground">On the Tools</h2></div>
                </div>
              </button>
            )}
          </div>

          <Button variant="outline" className="w-full" onClick={() => setSubStep(null)}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wrench className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Tradie Toolbelt</h1>
          </div>
        </div>

        <div className="grid gap-3">
          {settings.tutorialsEnabled && (
            <button onClick={() => { setTutorialOn(false); setMode("intro"); }} className="group rounded-xl border-2 border-border bg-card p-5 text-left">
              <div className="flex items-center gap-4"><Receipt className="w-6 h-6 text-primary" /><h2 className="text-base font-bold text-card-foreground">Intro Tutorial</h2></div>
            </button>
          )}

          <button onClick={() => setSubStep("manager-choice")} className="group rounded-xl border-2 border-border bg-card p-5 text-left">
            <div className="flex items-center gap-4"><Building2 className="w-6 h-6 text-primary" /><h2 className="text-base font-bold text-card-foreground">Manager / Owner</h2></div>
          </button>

          <button onClick={() => { setTutorialOn(true); setMode("work"); }} className="group rounded-xl border-2 border-border bg-card p-5 text-left">
            <div className="flex items-center gap-4"><Wrench className="w-6 h-6 text-primary" /><h2 className="text-base font-bold text-card-foreground">Employee</h2></div>
          </button>

          {settings.showTimesheetMode && (
            <button onClick={() => { setTutorialOn(false); setMode("timesheet"); }} className="group rounded-xl border-2 border-border bg-card p-5 text-left">
              <div className="flex items-center gap-4"><Shield className="w-6 h-6 text-primary" /><h2 className="text-base font-bold text-card-foreground">Timesheet Mode</h2></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
