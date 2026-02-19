import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppHeader } from "@/components/AppHeader";
import { DUMMY_CUSTOMERS } from "@/data/dummyCustomers";

type CustomerTab = "all" | "leads" | "active" | "archived";

const TABS: { id: CustomerTab; label: string }[] = [
  { id: "all", label: "All Customers" },
  { id: "leads", label: "Leads" },
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
];

export default function Customers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CustomerTab>("all");
  const [isDark, setIsDark] = useState(true);
  const isMobile = useIsMobile();

  const filtered = activeTab === "all"
    ? DUMMY_CUSTOMERS
    : DUMMY_CUSTOMERS.filter((c) => c.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Customers" isDark={isDark} onToggleDark={() => setIsDark((d) => !d)} />

      <div className={cn("flex", isMobile ? "flex-col" : "flex-row")}>
        {!isMobile && (
          <nav className="w-[200px] shrink-0 flex flex-col gap-1 py-2 border-r border-border">
            {TABS.map(({ id, label }) => (
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
                {label}
              </button>
            ))}
          </nav>
        )}

        {isMobile && (
          <div className="flex gap-1 p-2 overflow-x-auto border-b border-border">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">{filtered.length} customers</span>
            <Button size="sm" className="gap-1.5">
              <UserPlus className="w-4 h-4" />
              Add Customer
            </Button>
          </div>

          <div className="space-y-2">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/customer/${c.id}`)}
                className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-card-foreground truncate">{c.name}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>
                    {!isMobile && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>}
                    {!isMobile && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.address}</span>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{c.jobs} jobs</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
