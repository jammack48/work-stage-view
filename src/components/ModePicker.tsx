import { Shield, Wrench } from "lucide-react";
import { useAppMode } from "@/contexts/AppModeContext";
import { useTutorial } from "@/contexts/TutorialContext";

export function ModePicker() {
  const { setMode } = useAppMode();
  const { setTutorialOn } = useTutorial();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Wrench className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Tradie Toolbelt</h1>
        </div>
        <p className="text-muted-foreground text-sm">How are you using the app today?</p>
      </div>

      {/* Tutorial note */}
      <div className="w-full max-w-lg mb-5 rounded-lg bg-blue-500/10 border border-blue-500/30 px-4 py-3 text-center">
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          <strong>Tip:</strong> This is where you set access for your team. Staff on the tools only see their schedule and job details — no pricing, quotes, or management features.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {/* Manage */}
        <button
          onClick={() => setMode("manage")}
          className="group rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-card-foreground mb-1">Full Job System</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Full access — pipeline, quotes, invoices, pricing, reports, and team management.
          </p>
        </button>

        {/* Work */}
        <button
          onClick={() => { setTutorialOn(true); setMode("work"); }}
          className="group rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-card-foreground mb-1">I'm on the Tools</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Today's schedule, job details, time tracking, photos, and notes — no pricing.
          </p>
        </button>
      </div>
    </div>
  );
}
