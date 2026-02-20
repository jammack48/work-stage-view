import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomer } from "@/data/dummyCustomers";
import { AppHeader } from "@/components/AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, UserPlus, StickyNote, DollarSign, BarChart3, Briefcase,
  Phone, Mail, MapPin, Plus, Users
} from "lucide-react";

type CustTab = "overview" | "jobs" | "contacts" | "notes" | "spend" | "add-job";

const TABS: { id: CustTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "contacts", label: "Contacts", icon: UserPlus },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "spend", label: "Spend", icon: BarChart3 },
  { id: "add-job", label: "New Job", icon: Plus },
];

export default function CustomerCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CustTab>("overview");
  const isMobile = useIsMobile();

  const customer = getCustomer(Number(id));

  if (!customer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Customer not found</p>
      </div>
    );
  }

  function statusColor(s: string) {
    if (s === "active") return "bg-[hsl(var(--status-green))] text-white";
    if (s === "leads") return "bg-[hsl(var(--status-orange))] text-white";
    return "bg-muted text-muted-foreground";
  }

  const tabContent: Record<CustTab, React.ReactNode> = {
    overview: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
        {/* Status */}
        <div className="rounded-lg bg-card border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", statusColor(customer.status))}>
              {customer.status === "leads" ? "Lead" : customer.status === "active" ? "Active" : "Archived"}
            </span>
          </div>
          <div className="text-lg font-bold text-card-foreground">{customer.name}</div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{customer.phone}</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{customer.email}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />{customer.address}
          </div>
        </div>

        {/* Spend summary */}
        <div className="rounded-lg bg-card border border-border p-3">
          <div className="text-xs text-muted-foreground mb-1">Total Spend</div>
          <div className="text-2xl font-bold text-card-foreground">${customer.totalSpend.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-2">{customer.jobs} jobs total</div>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 rounded-md bg-[hsl(var(--status-green))]/20 p-2 text-center">
              <div className="text-sm font-bold text-card-foreground">{customer.jobHistory.filter(j => j.stage.includes("Paid")).length}</div>
              <div className="text-[10px] text-muted-foreground">Completed</div>
            </div>
            <div className="flex-1 rounded-md bg-[hsl(var(--status-orange))]/20 p-2 text-center">
              <div className="text-sm font-bold text-card-foreground">{customer.jobHistory.filter(j => j.stage === "In Progress" || j.stage === "To Invoice").length}</div>
              <div className="text-[10px] text-muted-foreground">In Progress</div>
            </div>
            <div className="flex-1 rounded-md bg-primary/20 p-2 text-center">
              <div className="text-sm font-bold text-card-foreground">{customer.jobHistory.filter(j => j.stage.includes("Quote") || j.stage === "Lead").length}</div>
              <div className="text-[10px] text-muted-foreground">Pipeline</div>
            </div>
          </div>
        </div>

        {/* Recent notes */}
        <div className="rounded-lg bg-card border border-border p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2">LATEST NOTES</div>
          {customer.notes.slice(0, 3).map((n, i) => (
            <div key={i} className="text-sm text-card-foreground py-1 border-b border-border last:border-0">{n}</div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="rounded-lg bg-card border border-border p-3 flex flex-col gap-2">
          <div className="text-xs font-semibold text-muted-foreground mb-1">QUICK ACTIONS</div>
          <Button size="sm" variant="outline" className="justify-start gap-2" onClick={() => setActiveTab("add-job")}>
            <Plus className="w-4 h-4" /> Create New Job
          </Button>
          <Button size="sm" variant="outline" className="justify-start gap-2">
            <Phone className="w-4 h-4" /> Call {customer.name.split(" ")[0]}
          </Button>
          <Button size="sm" variant="outline" className="justify-start gap-2">
            <Mail className="w-4 h-4" /> Send Email
          </Button>
          <Button size="sm" variant="outline" className="justify-start gap-2" onClick={() => setActiveTab("notes")}>
            <StickyNote className="w-4 h-4" /> Add Note
          </Button>
        </div>
      </div>
    ),

    jobs: (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-card-foreground">Jobs ({customer.jobHistory.length})</h2>
          <Button size="sm" className="gap-1.5" onClick={() => setActiveTab("add-job")}>
            <Plus className="w-4 h-4" /> New Job
          </Button>
        </div>
        {customer.jobHistory.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">No jobs yet</div>
        ) : (
          customer.jobHistory.map((j) => (
            <div
              key={j.id}
              onClick={() => navigate(`/job/${j.id}`)}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-card-foreground truncate">{j.name}</div>
                <div className="text-xs text-muted-foreground">{j.id} · {j.date}</div>
              </div>
              <div className="text-sm font-bold text-card-foreground">${j.value.toLocaleString()}</div>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap",
                j.stage.includes("Paid") ? "bg-[hsl(var(--status-green))] text-white" :
                j.stage.includes("Progress") || j.stage.includes("Invoice") ? "bg-[hsl(var(--status-orange))] text-white" :
                "bg-muted text-muted-foreground"
              )}>
                {j.stage}
              </span>
            </div>
          ))
        )}
      </div>
    ),

    contacts: (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-card-foreground">Contacts ({customer.contacts.length})</h2>
          <Button size="sm" className="gap-1.5"><UserPlus className="w-4 h-4" /> Add Contact</Button>
        </div>
        {customer.contacts.map((c, i) => (
          <div key={i} className="p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-card-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.role}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" />{c.phone}</a>
              <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" />{c.email}</a>
            </div>
          </div>
        ))}
      </div>
    ),

    notes: (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-card-foreground">Notes</h2>
          <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Note</Button>
        </div>
        {customer.notes.map((n, i) => (
          <div key={i} className="p-3 rounded-lg bg-card border border-border text-sm text-card-foreground">{n}</div>
        ))}
      </div>
    ),

    spend: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Spend Analytics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["Total Spend", `$${customer.totalSpend.toLocaleString()}`],
            ["Avg Job Value", customer.jobHistory.length ? `$${Math.round(customer.totalSpend / Math.max(customer.jobHistory.filter(j => j.stage.includes("Paid")).length, 1)).toLocaleString()}` : "$0"],
            ["Total Jobs", String(customer.jobHistory.length)],
            ["Outstanding", `$${customer.jobHistory.filter(j => !j.stage.includes("Paid")).reduce((s, j) => s + j.value, 0).toLocaleString()}`],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-lg bg-card border border-border text-center">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-lg font-bold text-card-foreground mt-1">{value}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-card border border-border p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2">SPEND BY STAGE</div>
          {["Invoice Paid", "In Progress", "To Invoice", "Quote Sent", "Lead"].map((stage) => {
            const total = customer.jobHistory.filter(j => j.stage === stage).reduce((s, j) => s + j.value, 0);
            if (total === 0) return null;
            const pct = customer.totalSpend > 0 ? Math.round((total / Math.max(customer.jobHistory.reduce((s, j) => s + j.value, 0), 1)) * 100) : 0;
            return (
              <div key={stage} className="flex items-center gap-3 py-1.5">
                <span className="text-xs text-muted-foreground w-24 shrink-0">{stage}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-card-foreground w-16 text-right">${total.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),

    "add-job": (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Create New Job for {customer.name}</h2>
        <p className="text-sm text-muted-foreground">This would open the new job form pre-filled with this customer's details.</p>
        <Button onClick={() => navigate(`/job/new?stage=Lead`)} className="gap-1.5">
          <Plus className="w-4 h-4" /> Create Job
        </Button>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title={customer.name}
        showBack
        backTo="/customers"
      />

      <div className={cn("flex", isMobile ? "flex-col" : "flex-row")}>
        {/* Desktop sidebar */}
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

        {/* Mobile bottom tabs */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center px-1 py-1 safe-area-pb overflow-x-auto gap-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-lg transition-colors gap-0.5 shrink-0",
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-none">{label}</span>
              </button>
            ))}
          </nav>
        )}

        <main className={cn("flex-1 min-w-0 p-4 sm:p-6", isMobile && "pb-24")}>
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
}
