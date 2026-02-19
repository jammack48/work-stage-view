import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Search, Phone, Mail, MapPin, ArrowLeft, Sun, Moon, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type CustomerTab = "all" | "leads" | "active" | "archived";

const TABS: { id: CustomerTab; label: string }[] = [
  { id: "all", label: "All Customers" },
  { id: "leads", label: "Leads" },
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
];

const DUMMY_CUSTOMERS = [
  { id: 1, name: "Dave Thompson", phone: "021 555 1234", email: "dave@example.com", address: "12 Queen St, Auckland", jobs: 3, status: "active" },
  { id: 2, name: "Sarah Mitchell", phone: "027 555 5678", email: "sarah@example.com", address: "45 Cuba St, Wellington", jobs: 5, status: "active" },
  { id: 3, name: "Mike O'Brien", phone: "022 555 9012", email: "mike@example.com", address: "8 Riccarton Rd, Christchurch", jobs: 1, status: "leads" },
  { id: 4, name: "Jenny Wu", phone: "021 555 3456", email: "jenny@example.com", address: "23 Devonport Rd, Tauranga", jobs: 0, status: "leads" },
  { id: 5, name: "Rangi Patel", phone: "027 555 7890", email: "rangi@example.com", address: "67 Colombo St, Christchurch", jobs: 8, status: "active" },
  { id: 6, name: "Tama Williams", phone: "022 555 2345", email: "tama@example.com", address: "15 Molesworth St, Wellington", jobs: 2, status: "archived" },
  { id: 7, name: "Lisa Chen", phone: "021 555 6789", email: "lisa@example.com", address: "90 Ponsonby Rd, Auckland", jobs: 4, status: "active" },
  { id: 8, name: "Hemi Brown", phone: "027 555 0123", email: "hemi@example.com", address: "33 Cameron Rd, Tauranga", jobs: 0, status: "leads" },
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
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Zap className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-card-foreground">Customers</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate("/settings")} className="h-8 px-2 gap-1.5 text-xs">
            <Settings className="w-4 h-4" />
            {!isMobile && "Settings"}
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

        {/* Mobile tabs */}
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

        {/* Main content */}
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
