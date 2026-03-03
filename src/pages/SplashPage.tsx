import { Wrench, CheckCircle2, ArrowRight, Zap, Clock, Users, FileText, ShoppingCart, Receipt, Mail, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PAIN_POINTS = [
  "Too slow getting back to enquiries?",
  "Struggling to keep up with customer follow-ups?",
  "Missing jobs because you're too busy working?",
  "Manually tracking time sheets?",
  "Quiet periods with no leads coming in?",
  "Chasing payments and paperwork after hours?",
];

const FEATURES = [
  { icon: Target, label: "Lead generation & automated follow-ups" },
  { icon: FileText, label: "Draft quoting on-site" },
  { icon: Zap, label: "Job sheets & scheduling" },
  { icon: Clock, label: "Time management & staff tracking" },
  { icon: ShoppingCart, label: "Purchase ordering" },
  { icon: Receipt, label: "Invoicing & payments" },
  { icon: Mail, label: "Automated customer comms" },
  { icon: Users, label: "Works for one-man bands to large teams" },
];

interface SplashPageProps {
  onStart: () => void;
}

export default function SplashPage({ onStart }: SplashPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
        <Badge variant="secondary" className="mb-4 text-xs tracking-wide uppercase">
          Beta Demo
        </Badge>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Tradie Toolbelt</h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
          Run your entire business from your phone.
        </p>
      </section>

      {/* Pain Points */}
      <section className="px-6 pb-12 md:pb-16 max-w-lg mx-auto">
        <h2 className="text-base font-bold text-center mb-5 text-foreground">Sound familiar?</h2>
        <div className="space-y-2.5">
          {PAIN_POINTS.map((point) => (
            <div
              key={point}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5"
            >
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-card-foreground">{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="px-6 pb-12 md:pb-16 max-w-lg mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-2">One app. First lead to final payment.</h2>
        <p className="text-sm text-muted-foreground mb-6">
          As simple or as complicated as you want to run your business.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <Icon className="w-4.5 h-4.5 text-primary shrink-0" />
              <span className="text-sm text-card-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Beta Notice */}
      <section className="px-6 pb-10 md:pb-14 max-w-lg mx-auto">
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 text-center space-y-2">
          <p className="text-sm font-semibold text-foreground">🚧 This is a beta demo</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All data is fake — you can't break anything. The goal is to test the interface and give
            feedback. All feedback is hugely appreciated to help shape the product.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16 md:pb-24 max-w-lg mx-auto">
        <Button size="lg" className="w-full text-base gap-2 h-12" onClick={onStart}>
          Start Demo <ArrowRight className="w-5 h-5" />
        </Button>
      </section>
    </div>
  );
}
