import { ArrowRight, CheckCircle2, Wrench, Zap, Send, Clock, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SplashPageProps {
  onStart: () => void;
}

/* ── Tiny inline mock components ── */

function PhoneMock() {
  const stages = ["Leads", "Quoted", "Accepted", "Scheduled", "In Progress", "To Invoice", "Paid"];
  const counts = [3, 5, 2, 4, 3, 2, 6];
  return (
    <div className="mx-auto w-[260px] sm:w-[300px] rounded-[2rem] border-[3px] border-foreground/15 bg-card shadow-xl p-2 pt-6 pb-4">
      {/* notch */}
      <div className="mx-auto w-20 h-1.5 rounded-full bg-foreground/10 mb-4" />
      {/* mini header */}
      <div className="flex items-center gap-2 px-3 mb-3">
        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
          <Wrench className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-[10px] font-bold text-foreground">Tradie Toolbelt</span>
      </div>
      {/* pipeline flow */}
      <div className="px-2 mb-3">
        <div className="flex items-center gap-0.5 text-[6px] font-semibold text-muted-foreground uppercase tracking-wider overflow-hidden">
          {stages.map((s, i) => (
            <span key={s} className={`truncate ${i === 0 ? "text-primary" : ""}`}>
              {s}{i < stages.length - 1 ? " ›" : ""}
            </span>
          ))}
        </div>
      </div>
      {/* mini cards */}
      <div className="space-y-1.5 px-2">
        {["Smith Kitchen Reno", "Jones Bathroom", "Taylor Roof Repair", "Brown Deck Build"].map((job, i) => (
          <div key={job} className="rounded-md border border-border bg-background p-2 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-semibold text-foreground">{job}</p>
              <p className="text-[6px] text-muted-foreground">${[4200, 8500, 3100, 12000][i]}</p>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${["bg-green-500", "bg-yellow-500", "bg-blue-500", "bg-primary"][i]}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniPipeline() {
  const cols = [
    { label: "Leads", count: 3, color: "bg-blue-500/20" },
    { label: "Quoted", count: 5, color: "bg-yellow-500/20" },
    { label: "In Progress", count: 4, color: "bg-green-500/20" },
    { label: "Paid", count: 6, color: "bg-primary/20" },
  ];
  return (
    <div className="flex gap-1.5 w-full">
      {cols.map((c) => (
        <div key={c.label} className={`flex-1 rounded-lg ${c.color} p-2`}>
          <p className="text-[8px] font-bold text-foreground mb-1">{c.label}</p>
          {Array.from({ length: Math.min(c.count, 3) }).map((_, i) => (
            <div key={i} className="h-2 rounded bg-foreground/10 mb-0.5" />
          ))}
          {c.count > 3 && <p className="text-[6px] text-muted-foreground">+{c.count - 3} more</p>}
        </div>
      ))}
    </div>
  );
}

function MiniQuote() {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-left space-y-1.5">
      <div className="flex justify-between items-center">
        <p className="text-[9px] font-bold text-foreground">Quote #1042</p>
        <span className="text-[7px] bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded px-1.5 py-0.5 font-semibold">Sent</span>
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between text-[7px] text-muted-foreground"><span>Kitchen tiling</span><span>$1,200</span></div>
        <div className="flex justify-between text-[7px] text-muted-foreground"><span>Materials</span><span>$450</span></div>
        <div className="flex justify-between text-[7px] text-muted-foreground"><span>Labour (8hrs)</span><span>$640</span></div>
      </div>
      <div className="border-t border-border pt-1 flex justify-between text-[8px] font-bold text-foreground">
        <span>Total</span><span>$2,290</span>
      </div>
    </div>
  );
}

function MiniInvoice() {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-left space-y-1.5">
      <div className="flex justify-between items-center">
        <p className="text-[9px] font-bold text-foreground">Invoice #2087</p>
        <span className="text-[7px] bg-green-500/20 text-green-700 dark:text-green-400 rounded px-1.5 py-0.5 font-semibold">Paid</span>
      </div>
      <p className="text-[7px] text-muted-foreground">Jones Bathroom Renovation</p>
      <div className="flex justify-between text-[8px] font-bold text-foreground">
        <span>Amount</span><span>$8,500</span>
      </div>
      <div className="h-1 rounded-full bg-green-500/30 overflow-hidden">
        <div className="h-full w-full bg-green-500 rounded-full" />
      </div>
    </div>
  );
}

function MiniSequence() {
  const steps = [
    { label: "SMS sent", time: "1 hour after quote", done: true },
    { label: "Email follow-up", time: "3 days", done: true },
    { label: "Final SMS", time: "7 days", done: false },
  ];
  return (
    <div className="space-y-1">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-green-500" : "border-2 border-muted-foreground/30"}`}>
            {s.done && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
          </div>
          <div className="flex-1">
            <p className="text-[8px] font-semibold text-foreground">{s.label}</p>
            <p className="text-[6px] text-muted-foreground">{s.time}</p>
          </div>
          {i < steps.length - 1 && <div className="absolute left-[7px] top-full w-0.5 h-1 bg-muted-foreground/20" />}
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ── */

const PAIN_POINTS = [
  "Quotes sent but never followed up",
  "Jobs written on scraps of paper",
  "Chasing invoices after hours",
  "Losing jobs because you're too busy",
];

const SOLUTION_ITEMS = [
  { icon: Zap, label: "Capture leads" },
  { icon: FileText, label: "Quote on site" },
  { icon: Clock, label: "Schedule jobs" },
  { icon: Send, label: "Track staff time" },
  { icon: Receipt, label: "Send invoices" },
];

export default function SplashPage({ onStart }: SplashPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <section className="px-6 pt-14 pb-10 md:pt-20 md:pb-14 text-center max-w-3xl mx-auto">
        <Badge variant="secondary" className="mb-4 text-xs tracking-wide uppercase">Beta Demo</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          Run your trade business<br className="hidden sm:block" /> without the paperwork.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6">
          Leads → Quotes → Jobs → Invoices → Paid.<br />
          All in one simple app.
        </p>
        <Button size="lg" className="h-12 text-base gap-2 px-8 mb-10" onClick={onStart}>
          Start Demo <ArrowRight className="w-5 h-5" />
        </Button>
        <PhoneMock />
      </section>

      {/* ── PROBLEM ── */}
      <section className="px-6 py-12 md:py-16 bg-muted/30">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Does this sound familiar?</h2>
          <div className="space-y-2.5 text-left">
            {PAIN_POINTS.map((p) => (
              <div key={p} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5">
                <CheckCircle2 className="w-5 h-5 text-destructive/70 shrink-0" />
                <span className="text-sm text-card-foreground">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Everything in one place.</h2>
          <p className="text-sm text-muted-foreground mb-6">As simple or as complicated as you need.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SOLUTION_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-card-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 FEATURE SNAPSHOTS ── */}
      <section className="px-6 py-12 md:py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quote */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-card-foreground">Quotes in seconds</h3>
              <p className="text-xs text-muted-foreground">Build and send quotes from site.</p>
              <MiniQuote />
            </div>
            {/* Pipeline */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-card-foreground">See every job</h3>
              <p className="text-xs text-muted-foreground">Pipeline view of all your work.</p>
              <MiniPipeline />
            </div>
            {/* Invoice */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-card-foreground">Get paid faster</h3>
              <p className="text-xs text-muted-foreground">Invoice and track payments.</p>
              <MiniInvoice />
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTOMATION HOOK ── */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">The app that chases customers for you.</h2>
          <p className="text-sm text-muted-foreground mb-6">Automatic follow-ups for quotes and invoices. Set it once, never forget again.</p>
          <div className="rounded-xl border border-border bg-card p-5 max-w-xs mx-auto">
            <MiniSequence />
          </div>
        </div>
      </section>

      {/* ── CLOSE CTA ── */}
      <section className="px-6 py-12 md:py-16 bg-muted/30">
        <div className="max-w-lg mx-auto text-center space-y-5">
          <h2 className="text-xl md:text-2xl font-bold">One app. From first enquiry to final payment.</h2>
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-2">
            <p className="text-sm font-semibold text-foreground">🚧 This is a beta demo</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All data is fake — you can't break anything. The goal is to test the interface and give feedback.
              All feedback is hugely appreciated to help shape the product.
            </p>
          </div>
          <Button size="lg" className="w-full max-w-sm h-12 text-base gap-2" onClick={onStart}>
            Start Demo <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
