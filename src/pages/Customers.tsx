import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { PageToolbar } from "@/components/PageToolbar";
import { DUMMY_CUSTOMERS } from "@/data/dummyCustomers";
import { buildTabs, handleCommonTab, CUSTOMER_LIST_EXTRAS } from "@/config/toolbarTabs";

type CustomerTab = "all" | "leads" | "active" | "archived";

const CUST_TABS = buildTabs(...CUSTOMER_LIST_EXTRAS);

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
        tabs={CUST_TABS}
        activeTab={activeTab}
        onTabChange={(id) => {
          if (handleCommonTab(id, navigate)) return;
          setActiveTab(id as CustomerTab);
        }}
        pageHeading={<h2 className="text-base font-bold text-card-foreground">Customer Directory</h2>}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{filtered.length} customers</span>
          <Button size="sm" className="gap-1.5"><UserPlus className="w-4 h-4" />Add Customer</Button>
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
      </PageToolbar>
    </>
  );
}
