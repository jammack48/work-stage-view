import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Phone, Mail, MapPin } from "lucide-react";
import { UNREAD_CLIENTS } from "@/data/dummyJobs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

import { PageToolbar } from "@/components/PageToolbar";
import { DUMMY_CUSTOMERS } from "@/data/dummyCustomers";
import { CUSTOMER_LIST_EXTRAS } from "@/config/toolbarTabs";

type CustomerTab = "all" | "leads" | "active" | "archived";

export default function Customers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CustomerTab>("all");
  const isMobile = useIsMobile();

  const filtered = activeTab === "all"
    ? DUMMY_CUSTOMERS
    : DUMMY_CUSTOMERS.filter((c) => c.status === activeTab);

  return (
    <>

      <PageToolbar
        currentPage="customers"
        tabs={CUSTOMER_LIST_EXTRAS}
        activeTab={activeTab}
        onTabChange={(id) => {
          if (id === "back") { navigate("/"); return; }
          setActiveTab(id as CustomerTab);
        }}
        pageHeading={<h2 className="text-base font-bold text-card-foreground">Customer Directory</h2>}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{filtered.length} customers</span>
          <Button size="sm" className="gap-1.5" onClick={() => { toast({ title: "Coming soon", description: "New customer form is under development." }); }}><UserPlus className="w-4 h-4" />Add Customer</Button>
        </div>
        <div className="space-y-2">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/customer/${c.id}`)}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-3 rounded-lg bg-card border border-border hover:bg-accent/50 cursor-pointer transition-colors min-h-[64px]"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-card-foreground truncate flex items-center gap-1.5">
                  {c.name}
                  {UNREAD_CLIENTS.has(c.name) && (
                    <>
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-glow-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.5)]" />
                      </span>
                      <Mail className="w-3.5 h-3.5 text-primary animate-wiggle shrink-0" />
                    </>
                  )}
                </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>
                  <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3 shrink-0" /><span className="truncate">{c.email}</span></span>
                  {!isMobile && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.address}</span>}
                </div>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{c.jobs} jobs</div>
            </div>
          ))}
        </div>
      </PageToolbar>
    </>
  );
}
