import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Zap, Users, Building2, Bell, Palette, Shield, CreditCard, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type SettingsTab = "business" | "notifications" | "appearance" | "billing" | "team" | "integrations";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "business", label: "Business Profile", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Wrench },
];

function SettingsContent({ tab }: { tab: SettingsTab }) {
  const sections: Record<SettingsTab, React.ReactNode> = {
    business: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Business Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["Business Name", "Thompson Plumbing & Electrical"],
            ["ABN / NZBN", "12-345-678-901"],
            ["Phone", "0800 TOOLBELT"],
            ["Email", "admin@toolbelt.co.nz"],
            ["Address", "42 Trade Ave, Auckland 1010"],
            ["Website", "www.toolbelt.co.nz"],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-lg bg-card border border-border">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-sm font-medium text-card-foreground mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    notifications: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Notifications</h2>
        {["New lead received", "Quote accepted", "Job completed", "Invoice overdue", "Team member assigned"].map((item) => (
          <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <span className="text-sm text-card-foreground">{item}</span>
            <div className="w-10 h-5 rounded-full bg-primary/80 relative">
              <div className="w-4 h-4 rounded-full bg-primary-foreground absolute right-0.5 top-0.5" />
            </div>
          </div>
        ))}
      </div>
    ),
    appearance: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Appearance</h2>
        <p className="text-sm text-muted-foreground">Theme and display preferences.</p>
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="text-sm text-card-foreground">Dark Mode</div>
          <div className="text-xs text-muted-foreground mt-0.5">Toggle via the sun/moon icon in the header</div>
        </div>
      </div>
    ),
    billing: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Billing</h2>
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="text-xs text-muted-foreground">Current Plan</div>
          <div className="text-sm font-medium text-card-foreground mt-0.5">Pro — $49/mo</div>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="text-xs text-muted-foreground">Next Billing Date</div>
          <div className="text-sm font-medium text-card-foreground mt-0.5">1 March 2026</div>
        </div>
      </div>
    ),
    team: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Team Members</h2>
        {["Admin — You", "Tech — Josh Turner", "Tech — Maria Santos", "Apprentice — Jake Hill"].map((m) => (
          <div key={m} className="p-3 rounded-lg bg-card border border-border text-sm text-card-foreground">{m}</div>
        ))}
      </div>
    ),
    integrations: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Integrations</h2>
        {["Xero Accounting", "Stripe Payments", "Google Calendar", "SMS Gateway"].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <span className="text-sm text-card-foreground">{i}</span>
            <Button size="sm" variant="outline">Connect</Button>
          </div>
        ))}
      </div>
    ),
  };
  return <>{sections[tab]}</>;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("business");
  const [isDark, setIsDark] = useState(true);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 sm:px-6 py-3 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Zap className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-card-foreground">Settings</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate("/customers")} className="h-8 px-2 gap-1.5 text-xs">
            <Users className="w-4 h-4" />
            {!isMobile && "Customers"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsDark((d) => !d)} className="h-8 w-8 p-0">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <div className={cn("flex", isMobile ? "flex-col" : "flex-row")}>
        {/* Sidebar */}
        {!isMobile && (
          <nav className="w-[200px] shrink-0 flex flex-col gap-1 py-2 border-r border-border">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left min-h-[48px]",
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        )}

        {/* Mobile tabs */}
        {isMobile && (
          <div className="flex gap-1 p-2 overflow-x-auto border-b border-border">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <SettingsContent tab={activeTab} />
        </main>
      </div>
    </div>
  );
}
